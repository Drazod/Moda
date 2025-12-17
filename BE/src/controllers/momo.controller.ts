import { Request, Response } from 'express';
import { prisma } from "..";
import crypto from 'crypto';
import axios from 'axios';
import { createOrderNoticeForUser } from './notice.controller';
import { addPointsFromPayment } from './points.controller';

const MoMoConfig = {
  partnerCode: "MOMO",
  accessKey: "F8BBA842ECF85",
  secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
  apiUrl: 'https://test-payment.momo.vn/v2/gateway/api/create',
  redirectUrl: 'http://localhost:4000/momo/payment-return',
  ipnUrl: 'http://localhost:4000/momo/payment-notify', // IPN callback URL
};

// Generate MoMo payment URL
export const createPayment = async (req: Request, res: Response) => {
  const { orderId, amount, orderType, address, couponCode, pointsUsed } = req.body;
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

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

  // Update cart with address and coupon
  await prisma.cart.update({
    where: { id: orderId },
    data: {
      address: address,
      couponCode: couponCode
    }
  });

  try {
    const requestId = MoMoConfig.partnerCode + new Date().getTime();
    const orderInfo = `Payment for Order #${orderId}${pointsUsed ? ` - Points: ${pointsUsed}` : ''}`;
    const requestType = "captureWallet";
    const extraData = ""; // Pass empty value if your merchant does not have stores
    const orderIdd = MoMoConfig.partnerCode + new Date().getTime();
    // Create raw signature
    const rawSignature = 
      `accessKey=${MoMoConfig.accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&ipnUrl=${MoMoConfig.ipnUrl}` +
      `&orderId=${orderIdd}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${MoMoConfig.partnerCode}` +
      `&redirectUrl=${MoMoConfig.redirectUrl}` +
      `&requestId=${requestId}` +
      `&requestType=${requestType}`;

    console.log("--------------------RAW SIGNATURE----------------");
    console.log(rawSignature);

    // Generate signature
    const signature = crypto.createHmac('sha256', MoMoConfig.secretKey)
      .update(rawSignature)
      .digest('hex');

    console.log("--------------------SIGNATURE----------------");
    console.log(signature);

    // Request body
    const requestBody = {
      partnerCode: MoMoConfig.partnerCode,
      accessKey: MoMoConfig.accessKey,
      requestId: requestId,
      amount: amount.toString(),
      orderId: orderIdd,
      orderInfo: orderInfo,
      redirectUrl: MoMoConfig.redirectUrl,
      ipnUrl: MoMoConfig.ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: 'vi'
    };

    console.log("Sending MoMo payment request....");

    // Send request to MoMo
    const response = await axios.post(MoMoConfig.apiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('MoMo Response:', response.data);

    if (response.data.resultCode === 0) {
      // Success - return payment URL
      return res.status(200).json({ 
        paymentUrl: response.data.payUrl,
        requestId: requestId
      });
    } else {
      // Error from MoMo
      return res.status(400).json({ 
        message: response.data.message || 'MoMo payment creation failed',
        resultCode: response.data.resultCode
      });
    }

  } catch (error: any) {
    console.error('MoMo payment error:', error.response?.data || error.message);
    return res.status(500).json({ 
      message: "Error creating MoMo payment",
      error: error.response?.data || error.message
    });
  }
};

// Handle MoMo return URL (user redirect)
export const handleReturn = async (req: Request, res: Response) => {
  console.log('MoMo Return Query:', req.query);
  
  const {
    partnerCode,
    orderId,
    requestId,
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
    signature
  } = req.query;

  // Verify signature
  const rawSignature = 
    `accessKey=${MoMoConfig.accessKey}` +
    `&amount=${amount}` +
    `&extraData=${extraData}` +
    `&message=${message}` +
    `&orderId=${orderId}` +
    `&orderInfo=${orderInfo}` +
    `&orderType=${orderType}` +
    `&partnerCode=${partnerCode}` +
    `&payType=${payType}` +
    `&requestId=${requestId}` +
    `&responseTime=${responseTime}` +
    `&resultCode=${resultCode}` +
    `&transId=${transId}`;

  const computedSignature = crypto.createHmac('sha256', MoMoConfig.secretKey)
    .update(rawSignature)
    .digest('hex');

  if (signature !== computedSignature) {
    console.error('Invalid MoMo signature');
    return res.redirect('http://localhost:5173/payment-failed?message=InvalidSignature');
  }

  if (resultCode === '0') {
    // Payment successful
    const orderIdNum = Number(orderId);
    const amountNum = Number(amount);

    // Extract pointsUsed from orderInfo
    const orderInfoStr = orderInfo as string;
    let pointsUsed = 0;
    const pointsMatch = orderInfoStr.match(/Points: (\d+)/);
    if (pointsMatch) {
      pointsUsed = parseInt(pointsMatch[1], 10);
    }

    // Get user and cart info
    let userId: number | undefined = undefined;
    let addressStr: string | undefined = undefined;
    let couponCode: string | undefined = undefined;

    try {
      const cart = await prisma.cart.findUnique({
        where: { id: orderIdNum },
        include: { user: true },
      });
      
      if (cart) {
        userId = cart.userId;
        addressStr = cart.address || (cart.user && cart.user.address) || "";
        couponCode = cart.couponCode || undefined;
      }
    } catch (err) {
      console.error('Error fetching cart/user:', err);
    }

    if (!userId) {
      return res.redirect('http://localhost:5173/payment-failed?message=NoUser');
    }

    let transaction;
    try {
      // Transaction with race condition protection
      const result = await prisma.$transaction(async (tx) => {
        // 1. Get cart items with stock information across all branches
        const cartItems = await tx.cartItem.findMany({ 
          where: { cartId: orderIdNum },
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
                    quantity: { gt: 0 }
                  },
                  orderBy: {
                    quantity: 'desc'
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
            amount: amountNum,
            method: 'momo',
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
          
          if (addressStr) {
            await tx.shipping.create({
              data: {
                address: addressStr,
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
          where: { id: orderIdNum },
          data: { state: 'ORDERED' },
        });

        return { transaction: newTransaction, cartItems };
      }, {
        isolationLevel: 'Serializable',
        maxWait: 5000,
        timeout: 10000,
      });
      
      transaction = result.transaction;
    } catch (err: any) {
      console.error('Error creating transaction:', err);
      
      // Check if it's a stock-related error - USER ALREADY PAID
      if (err.message && (err.message.includes('Insufficient stock') || err.message.includes('Stock depleted'))) {
        // For MoMo, refund process is different - need to contact MoMo support or use refund API
        console.error(`❌ Stock depleted for order ${orderIdNum} after MoMo payment. Manual refund required.`);
        return res.redirect(`http://localhost:5173/payment-failed?message=StockDepleted&refund=contact-support&details=${encodeURIComponent(err.message)}`);
      }
      
      return res.redirect('http://localhost:5173/payment-failed?message=DBError');
    }

    // Payment successful - process coupon and notifications
    if (couponCode) {
      await prisma.coupon.update({
        where: { couponCode },
        data: { stock: { decrement: 1 } },
      }).catch(err => console.error('Error updating coupon:', err));
    }

    if (userId && orderIdNum) {
      await createOrderNoticeForUser({ userId, orderId: orderIdNum })
        .catch(err => console.error('Error creating notice:', err));
    }
    
    if (userId && transaction) {
      await addPointsFromPayment(userId, transaction.id, amountNum)
        .catch(err => console.error('Error adding points:', err));
    }
    
    return res.redirect(`http://localhost:5173/payment-success?orderId=${orderIdNum}&pointsUsed=${pointsUsed}`);
  } else {
    // Payment failed
    return res.redirect(`http://localhost:5173/payment-failed?orderId=${orderId}&errorCode=${resultCode}&message=${encodeURIComponent(message as string)}`);
  }
};

// Handle MoMo IPN (Instant Payment Notification) - webhook callback
export const handleIPN = async (req: Request, res: Response) => {
  console.log('MoMo IPN Notification:', req.body);
  
  const {
    partnerCode,
    orderId,
    requestId,
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
    signature
  } = req.body;

  // Verify signature
  const rawSignature = 
    `accessKey=${MoMoConfig.accessKey}` +
    `&amount=${amount}` +
    `&extraData=${extraData}` +
    `&message=${message}` +
    `&orderId=${orderId}` +
    `&orderInfo=${orderInfo}` +
    `&orderType=${orderType}` +
    `&partnerCode=${partnerCode}` +
    `&payType=${payType}` +
    `&requestId=${requestId}` +
    `&responseTime=${responseTime}` +
    `&resultCode=${resultCode}` +
    `&transId=${transId}`;

  const computedSignature = crypto.createHmac('sha256', MoMoConfig.secretKey)
    .update(rawSignature)
    .digest('hex');

  if (signature !== computedSignature) {
    console.error('Invalid MoMo IPN signature');
    return res.status(400).json({ message: 'Invalid signature' });
  }

  // Process IPN based on resultCode
  if (resultCode === 0) {
    console.log(`✅ MoMo IPN: Payment successful for order ${orderId}, transId: ${transId}`);
    // Additional processing if needed (logging, notifications, etc.)
  } else {
    console.log(`❌ MoMo IPN: Payment failed for order ${orderId}, resultCode: ${resultCode}`);
  }

  // Always return 204 No Content to MoMo to acknowledge receipt
  return res.status(204).send();
};
