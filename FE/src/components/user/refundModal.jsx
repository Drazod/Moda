import React, { useState } from 'react';

const RefundModal = ({ transaction, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    quantity: 1,
    reason: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit({
        transactionDetailId: transaction.transactionDetailId, // You may need to adjust this based on your transaction structure
        quantity: parseInt(formData.quantity),
        reason: formData.reason
      });
    } catch (error) {
      console.error('Refund submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#efe5d6] rounded-2xl p-8 w-full max-w-md mx-4">
        <h2 className="text-2xl font-semibold mb-6 text-[#434237]">Request Refund</h2>
        
        <div className="mb-4 p-4 bg-[#BFAF92] rounded-lg">
          <h3 className="font-semibold text-[#434237]">Order Details</h3>
          <p className="text-sm text-gray-700">Order ID: {transaction?.orderId}</p>
          <p className="text-sm text-gray-700">Item: {transaction?.detail}</p>
          <p className="text-sm text-gray-700">Price: {transaction?.price}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#434237] mb-2">
              Quantity to Refund
            </label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#434237]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#434237] mb-2">
              Reason for Refund
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#434237]"
              placeholder="Please explain why you want to return this item..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-[#434237] text-[#434237] rounded-lg hover:bg-[#434237] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-[#434237] text-white rounded-lg hover:bg-[#2f2e25] transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefundModal;