import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDeleteCartMutation } from '../configs/product/addProductSlice';

const PaymentSuccess = () => {
  const query = new URLSearchParams(useLocation().search);
  const orderId = query.get('orderId');
  const [deleteCart] = useDeleteCartMutation();
  const navigate = useNavigate();

  useEffect(() => {
    // Call deleteCart when the component mounts (after payment success)
    if (orderId) {
        deleteCart({ cartId: 1});
    }
  }, [orderId]);

  const handleGoHome = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center text-center justify-center bg-[#bfaF92]">
      <h1 className="absolute text-8xl font-dancing top-40">Moda</h1>
      
      <div className="w-full max-w-md px-6">
        <div className="bg-[#efe5d6] rounded-2xl p-8 shadow-lg">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          {/* Success Message */}
          <h2 className="text-2xl font-semibold mb-2 text-green-600">Payment Successful!</h2>
          <p className="mb-6 text-gray-700">
            Thank you for your purchase. Your payment for Order #{orderId} has been processed successfully.
          </p>
          
          {/* Action Button */}
          <button
            onClick={handleGoHome}
            className="w-full py-3 rounded bg-[#434237] text-white font-semibold hover:bg-[#2f2e25] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
