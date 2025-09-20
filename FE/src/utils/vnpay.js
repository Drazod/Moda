import axiosInstance from "../configs/axiosInstance";

// Helper to call backend and get VNPay payment URL
export async function createVNPayPayment({ orderId, amount, orderDescription, orderType, language, bankCode, address }) {
  const res = await axiosInstance.post("/vnpay/create-payment", {
    orderId,
    amount,
    orderDescription,
    orderType,
    language,
    bankCode,
    address,
  });
  return res.data.paymentUrl;
}
