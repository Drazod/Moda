import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentFail = () => {
  const query = new URLSearchParams(useLocation().search);
  const orderId = query.get('orderId');
  const errorCode = query.get('errorCode');
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate('/cart');
  };

  const handleGoHome = () => {
    navigate('/home');
  };

  // Get specific error message based on error code
  const getErrorMessage = (code) => {
    const errorMessages = {
      '24': 'Transaction was cancelled by user',
      '23': 'Payment declined by bank',
      '22': 'Insufficient funds',
      '21': 'Card expired or invalid',
      '20': 'Network timeout',
      'default': 'Payment could not be processed'
    };
    return errorMessages[code] || errorMessages['default'];
  };

  return (
    <div className="min-h-screen flex flex-col items-center text-center justify-center bg-[#bfaF92]">
      <h1 className="absolute text-8xl font-dancing top-40">Moda</h1>
      
      <div className="w-full max-w-md px-6">
        <div className="bg-[#efe5d6] rounded-2xl p-8 shadow-lg">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          
          {/* Error Message */}
          <h2 className="text-2xl font-semibold mb-2 text-red-600">Payment Failed</h2>
          <p className="mb-4 text-gray-700">
            {orderId ? `Order #${orderId}` : 'Your payment'} could not be processed.
          </p>
          
          {errorCode && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-700">
                <span className="font-semibold">Error Code {errorCode}:</span> {getErrorMessage(errorCode)}
              </p>
            </div>
          )}
          
          <p className="mb-6 text-gray-600 text-sm">
            Please try again or contact support if the issue persists.
          </p>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleTryAgain}
              className="w-full py-3 rounded bg-[#434237] text-white font-semibold hover:bg-[#2f2e25] transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleGoHome}
              className="w-full py-3 rounded border border-[#434237] text-[#434237] font-semibold hover:bg-[#434237] hover:text-white transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;
