import { Request, Response } from 'express';
import querystring from 'querystring';
import crypto from 'crypto';

const VNPayConfig = {
  tmnCode: "RJOCMWWT",
  hashSecret: "FPP5WJL2BAZHHJP479I8R969UO80Q0S7",
  vnpUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html', // Sandbox URL
  returnUrl: 'http://localhost:4000/vnpay/payment-return', // Update with your return URL
};

// Generate payment URL
export const createPayment = async (req: Request, res: Response) => {
  const { orderId, amount, orderDescription, orderType, language, bankCode } = req.body;

  const ipAddr = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '';

  const date = new Date();
  const createDate = date.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const locale = language || 'vn';  // Fallback to 'vn' if not provided
  const currCode = 'VND';

  const vnpParams: Record<string, string | number> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: VNPayConfig.tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderDescription || `Payment for Order #${orderId}`,
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
export const handleReturn = (req: Request, res: Response) => {
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
        // Payment successful, redirect to success page
        res.redirect(`http://localhost:3000/payment-success?orderId=${vnp_Params['vnp_TxnRef']}`);
      } else {
        // Payment failed, redirect to failure page
        res.redirect(`http://localhost:3000/payment-failed?orderId=${vnp_Params['vnp_TxnRef']}&errorCode=${responseCode}`);
      }
    } else {
      // Invalid signature, redirect to an error page
      res.redirect('http://localhost:3000/payment-error?message=InvalidSignature');
    }
  };
