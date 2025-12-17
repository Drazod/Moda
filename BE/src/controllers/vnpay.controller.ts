import { Request, Response } from 'express';
import { prisma } from "..";
import querystring from 'querystring';
import crypto from 'crypto';
import { createOrderNoticeForUser } from './notice.controller';
import { addPointsFromPayment } from './points.controller';
import axios from 'axios';

const VNPayConfig = {
  tmnCode: "Z3KUNPVD",
  hashSecret: "ER456RD4HMX9C0ZGXOEGIPHPIQWMK4P3",
  vnpUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html', // Sandbox URL
  apiUrl: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction', // Refund API URL
  returnUrl: 'https://moda-production.up.railway.app/vnpay/payment-return', // Update with your return URL
};

// Generate payment URL
export const createPayment = async (req: Request, res: Response) => {
  const { orderId, amount, orderType, language, bankCode, address, couponCode, pointsUsed } = req.body;
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const ipAddr = "127.0.0.1";
  
  // 🔒 RACE CONDITION PREVENTION: Check stock availability BEFORE creating payment
  try {
    const cartItems = await prisma.cartItem.findMany({ 
      where: { cartId: orderId },
      include: {
        sourceBranch: true,
        pickupBranch: true,
        Size: {
          include: {
            stocks: true // Get stock across all branches for this size
          }
        }
      }
    });
    
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    
    // Pre-validate stock availability across all branches
    for (const item of cartItems) {
      // Get total available stock across all branches for this size
      const totalAvailable = item.Size?.stocks?.reduce((sum, stock) => sum + stock.quantity, 0) || 0;
      
      if (totalAvailable < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for item. Total available: ${totalAvailable}, Requested: ${item.quantity}`,
          clothesId: item.ClothesId,
          sizeId: item.sizeId
        });
      }
    }
  } catch (err) {
    console.error('Error validating stock:', err);
    return res.status(500).json({ message: "Error validating stock availability" });
  }
  
  await prisma.cart.update({
    where: { id: orderId },
    data: {
      address: address,
      couponCode: couponCode
    }
  });
  const date = new Date();
  const createDate = date.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const locale = language || 'vn';  // Fallback to 'vn' if not provided
  const currCode = 'VND';

  // Generate txnRef: YYYYMMDD + orderId (auto-incrementing number based on date and order)
  const datePrefix = date.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const txnRef = `${datePrefix}${orderId}`;

  const vnpParams: Record<string, string | number> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: VNPayConfig.tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: txnRef,
    vnp_OrderInfo:  `Payment for Order #${orderId}${pointsUsed ? ` - Points: ${pointsUsed}` : ''}`,
    vnp_OrderType: orderType || 'other',
    vnp_Amount: amount * 100,  // Convert to smallest currency unit (e.g., VND)
    vnp_ReturnUrl: VNPayConfig.returnUrl,
    vnp_IpAddr: ipAddr || '',
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnpParams['vnp_BankCode'] = bankCode;
  }
  // Sort parameters
  const sortedParams = Object.keys(vnpParams)
    .sort() // Sort the keys in lexicographical order
    .reduce((result, key) => {
        result[key] = encodeURIComponent(vnpParams[key]).replace(/%20/g, "+");
        return result;
    }, {} as Record<string, string | number>);


  const qs = require('qs');
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", VNPayConfig.hashSecret);
  const secureHash = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
  sortedParams['vnp_SecureHash'] = secureHash;
  const paymentUrl = VNPayConfig.vnpUrl + '?' + qs.stringify(sortedParams, { encode: false });
  console.log(paymentUrl);
  res.status(200).json({ paymentUrl });
};

// Handle return URL response
export const handleReturn = async (req: Request, res: Response) => {
    console.log(req.query);
    const vnp_Params = { ...req.query } as Record<string, string | number>; 
    const secureHash = vnp_Params['vnp_SecureHash']; 
    delete vnp_Params['vnp_SecureHash']; 
    delete vnp_Params['vnp_SecureHashType']; 
    // Sort the parameters
    const sortedParams = Object.keys(vnp_Params)
    .sort() // Sort the keys in lexicographical order
    .reduce((result, key) => {
        result[key] = encodeURIComponent(vnp_Params[key]).replace(/%20/g, "+");
        return result;
    }, {} as Record<string, string | number>);

    // Create a signature using the sorted parameters
    const signData = querystring.stringify(sortedParams, '&', '=', {
      encodeURIComponent: (str: string) => str, // Avoid additional encoding
    });
    const hmac = crypto.createHmac('sha512', VNPayConfig.hashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed){
      const responseCode = vnp_Params['vnp_ResponseCode'];
      if (responseCode === '00') {
        // Payment successful, create Transaction and Shipping
        // You may need to adjust how you get userId, address, couponCode, etc.
        const txnRef = String(vnp_Params['vnp_TxnRef']); // Format: YYYYMMDD + orderId
        const orderId = Number(txnRef.slice(8)); // Extract orderId after date prefix (8 chars: YYYYMMDD)
        const amount = Number(vnp_Params['vnp_Amount']) / 100; // Convert back to normal unit
        
        // Extract pointsUsed from orderInfo
        const orderInfo = vnp_Params['vnp_OrderInfo'] as string;
        let pointsUsed = 0;
        const pointsMatch = orderInfo.match(/Points: (\d+)/);
        if (pointsMatch) {
          pointsUsed = parseInt(pointsMatch[1], 10);
        }
        // You may want to get userId and address from session, db, or FE
        // For demo, try to get from query (not secure for production)
        // Fetch userId, address, and couponCode from the cart using the cart id
        let userId: number | undefined = undefined;
        let address: string | undefined = undefined;
        let couponCode: string | undefined = undefined;
        try {
          const cart = await prisma.cart.findUnique({
            where: { id: orderId },
            include: { user: true },
          });
          if (cart) {
            userId = cart.userId;
            address = cart.address || (cart.user && cart.user.address) || "";
            couponCode = cart.couponCode || undefined;
          }
        } catch (err) {
          console.error('Error fetching cart/user for address/coupon:', err);
        }
        if (!userId) {
          return res.redirect('https://moda-six.vercel.app/payment-failed?message=NoUser');
        }
        let transaction;
        try {
          // Transaction with race condition protection
          const result = await prisma.$transaction(async (tx) => {
            // 1. Get cart items with stock information across all branches
            const cartItems = await tx.cartItem.findMany({ 
              where: { cartId: orderId },
              include: {
                sourceBranch: true,
                pickupBranch: true,
                Size: {
                  include: {
                    stocks: {
                      include: {
                        branch: true
                      },
                      where: {
                        quantity: { gt: 0 } // Only branches with stock
                      },
                      orderBy: {
                        quantity: 'desc' // Prefer branches with more stock
                      }
                    }
                  }
                }
              }
            });
            
            if (cartItems.length === 0) {
              throw new Error('No items in cart');
            }

            // 2. Check and decrement stock across available branches
            for (const item of cartItems) {
              const availableStocks = item.Size?.stocks || [];
              const totalAvailable = availableStocks.reduce((sum, stock) => sum + stock.quantity, 0);
              
              if (totalAvailable < item.quantity) {
                throw new Error(`Insufficient stock for item ${item.ClothesId}. Total available: ${totalAvailable}, Requested: ${item.quantity}`);
              }

              // Allocate from branches based on availability
              let remaining = item.quantity;
              
              for (const stock of availableStocks) {
                if (remaining <= 0) break;
                
                const toDecrement = Math.min(stock.quantity, remaining);
                
                // Atomic decrement with condition check
                const updatedStock = await tx.stock.updateMany({
                  where: {
                    branchId: stock.branchId,
                    sizeId: item.sizeId,
                    quantity: { gte: toDecrement }
                  },
                  data: {
                    quantity: { decrement: toDecrement }
                  }
                });
                
                if (updatedStock.count === 0) {
                  throw new Error(`Stock depleted during checkout for item ${item.ClothesId} at branch ${stock.branch.code}`);
                }
                
                remaining -= toDecrement;
              }
              
              if (remaining > 0) {
                throw new Error(`Could not allocate all stock for item ${item.ClothesId}. Remaining: ${remaining}`);
              }
            }

            // 3. Create transaction record
            const newTransaction = await tx.transaction.create({
              data: {
                amount,
                method: 'vnpay',
                userId,
                couponCode: couponCode || undefined,
              },
            });

            // 4. Create transaction details with shipping for each item
            for (const item of cartItems) {
              const transactionDetail = await tx.transactionDetail.create({
                data: {
                  transactionId: newTransaction.id,
                  clothesId: item.ClothesId,
                  sizeId: item.sizeId,
                  quantity: item.quantity,
                  price: item.totalprice,
                },
              });

              // Create shipping record for this transaction detail
              const shippingBranchId = item.fulfillmentMethod === 'pickup' 
                ? item.pickupBranchId 
                : item.sourceBranchId;
              const shippingType = item.fulfillmentMethod === 'pickup' ? 'PICKUP' : 'SHIP';
              
              if (address) {
                await tx.shipping.create({
                  data: {
                    address,
                    userId,
                    transactionDetailId: transactionDetail.id,
                    branchId: shippingBranchId || null,
                    type: shippingType,
                    State: 'ORDERED',
                  },
                });
              }
            }

            // 6. Update cart state to ORDERED
            await tx.cart.update({
              where: { id: orderId },
              data: { state: 'ORDERED' },
            });

            return { transaction: newTransaction, cartItems };
          }, {
            isolationLevel: 'Serializable', // Highest isolation level to prevent race conditions
            maxWait: 5000, // Maximum time to wait for transaction to start
            timeout: 10000, // Maximum time transaction can run
          });
          
          transaction = result.transaction;
        } catch (err: any) {
          console.error('Error creating transaction/shipping or updating sizes:', err);
          
          // Check if it's a stock-related error - USER ALREADY PAID, NEED REFUND!
          if (err.message && (err.message.includes('Insufficient stock') || err.message.includes('Stock depleted'))) {
            // Attempt automatic refund
            try {
              const vnpTransactionNo = vnp_Params['vnp_TransactionNo'] as string;
              const vnpTransactionDate = vnp_Params['vnp_PayDate'] as string;
              
              await processRefund({
                orderId,
                amount,
                txnRef: orderId.toString(),
                transactionNo: vnpTransactionNo,
                transactionDate: vnpTransactionDate,
                reason: `Stock depleted: ${err.message}`,
                createdBy: 'System-AutoRefund'
              });
              
              console.log(`✅ Automatic refund initiated for order ${orderId} due to stock depletion`);
              return res.redirect(`https://moda-six.vercel.app/payment-failed?message=StockDepleted&refund=processing&details=${encodeURIComponent(err.message)}`);
            } catch (refundErr) {
              console.error('❌ Automatic refund failed:', refundErr);
              return res.redirect(`https://moda-six.vercel.app/payment-failed?message=StockDepleted&refund=failed&details=${encodeURIComponent(err.message)}`);
            }
          }
          
          // Generic database error
          return res.redirect('https://moda-six.vercel.app/payment-failed?message=DBError');
        }
        // Payment successful, redirect to success page
        if (couponCode) {
          await prisma.coupon.update({
            where: { couponCode },
            data: { stock: { decrement: 1 } },
          });
        }
        // Create notice for user when payment is successful
        if (userId && orderId) {
          await createOrderNoticeForUser({ userId, orderId });
        }
        
        // Add points to user from payment (100,000 VND = 100 points)
        if (userId && transaction) {
          await addPointsFromPayment(userId, transaction.id, amount);
        }
        
        return res.redirect(`https://moda-six.vercel.app/payment-success?orderId=${orderId}&pointsUsed=${pointsUsed}`);
      } else {
        // Payment failed, redirect to failure page
        return res.redirect(`https://moda-six.vercel.app/payment-failed?orderId=${vnp_Params['vnp_TxnRef']}&errorCode=${responseCode}`);
      }
    } else {
      // Invalid signature, redirect to an error page
      return res.redirect('https://moda-six.vercel.app/payment-failed?message=InvalidSignature');
    }
};

// VNPay Refund Function
interface RefundParams {
  orderId: number;
  amount: number;
  txnRef: string;
  transactionNo?: string;
  transactionDate: string;
  reason: string;
  createdBy: string;
}

const processRefund = async (params: RefundParams) => {
  const { orderId, amount, txnRef, transactionNo, transactionDate, reason, createdBy } = params;
  
  const requestId = `${Date.now()}`; // Unique request ID (no duplicates in same day)
  const createDate = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const ipAddr = '127.0.0.1'; // Server IP address
  
  // Build refund data according to VNPay specification
  const refundData = {
    vnp_RequestId: requestId,
    vnp_Version: '2.1.0',
    vnp_Command: 'refund',
    vnp_TmnCode: VNPayConfig.tmnCode,
    vnp_TransactionType: '02', // 02 = Full refund, 03 = Partial refund
    vnp_TxnRef: txnRef,
    vnp_Amount: (amount * 100).toString(), // Convert to smallest unit
    vnp_OrderInfo: reason,
    vnp_TransactionNo: transactionNo || '',
    vnp_TransactionDate: transactionDate,
    vnp_CreateBy: createdBy,
    vnp_CreateDate: createDate,
    vnp_IpAddr: ipAddr
  };

  // Generate secure hash according to VNPay specification
  // data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + 
  //        vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|" + 
  //        vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo
  const data = `${refundData.vnp_RequestId}|${refundData.vnp_Version}|${refundData.vnp_Command}|${refundData.vnp_TmnCode}|${refundData.vnp_TransactionType}|${refundData.vnp_TxnRef}|${refundData.vnp_Amount}|${refundData.vnp_TransactionNo}|${refundData.vnp_TransactionDate}|${refundData.vnp_CreateBy}|${refundData.vnp_CreateDate}|${refundData.vnp_IpAddr}|${refundData.vnp_OrderInfo}`;
  
  const hmac = crypto.createHmac('sha512', VNPayConfig.hashSecret);
  const secureHash = hmac.update(Buffer.from(data, 'utf-8')).digest('hex');
  
  const refundPayload = {
    ...refundData,
    vnp_SecureHash: secureHash
  };

  console.log('🔄 Sending refund request to VNPay:', {
    orderId,
    amount,
    requestId,
    txnRef
  });

  try {
    const response = await axios.post(VNPayConfig.apiUrl, refundPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ VNPay refund response:', response.data);
    
    // TODO: Log refund in database for tracking (create VNPayRefund model)
    // For now, just return the response
    
    return response.data;
  } catch (error: any) {
    console.error('❌ VNPay refund request failed:', error.response?.data || error.message);
    throw new Error(`Refund failed: ${error.response?.data?.vnp_Message || error.message}`);
  }
};

// Manual refund endpoint (for admin use)
export const manualRefund = async (req: Request, res: Response) => {
  try {
    const { orderId, txnRef, transactionNo, transactionDate, reason } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get transaction details
    const cart = await prisma.cart.findUnique({
      where: { id: orderId },
      include: {
        items: true
      }
    });

    if (!cart) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Calculate total amount from cart items
    const amount = cart.items.reduce((sum, item) => sum + item.totalprice, 0);

    const result = await processRefund({
      orderId,
      amount,
      txnRef: txnRef || orderId.toString(),
      transactionNo,
      transactionDate,
      reason: reason || 'Manual refund by admin',
      createdBy: `User-${userId}`
    });

    return res.status(200).json({
      message: 'Refund processed successfully',
      data: result
    });
  } catch (error: any) {
    console.error('Manual refund error:', error);
    return res.status(500).json({
      message: 'Refund failed',
      error: error.message
    });
  }
};

// Remove old incomplete refund function
// const requestRefund = async (orderId: number, amount: number, txnRef: string) => {
//   ...
// }
