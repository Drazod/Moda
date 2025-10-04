import React, { useState } from 'react';

const RefundModal = ({ transaction, onClose, onSubmit }) => {
  const maxQuantity = transaction?.availableForRefund || ((transaction?.originalQuantity || transaction?.quantity || 0) - (transaction?.refundedQuantity || 0));
  const [formData, setFormData] = useState({
    quantity: Math.min(1, maxQuantity),
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(maxQuantity <= 0 ? 'No items available for refund' : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (formData.quantity > maxQuantity) {
      setError(`Cannot refund more than ${maxQuantity} items`);
      setLoading(false);
      return;
    }
    
    try {
      await onSubmit({
        transactionDetailId: transaction.transactionDetailId || transaction.id,
        quantity: parseInt(formData.quantity),
        reason: formData.reason
      });
      // Success handled by parent component (modal will close)
      setLoading(false);
    } catch (error) {
      console.error('Refund submission error:', error);
      setError(error.response?.data?.message || 'Failed to submit refund request');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'quantity') {
      const numValue = parseInt(value);
      // Ensure quantity doesn't exceed maximum available
      if (numValue > maxQuantity) {
        setError(`Cannot refund more than ${maxQuantity} items`);
        return;
      } else if (numValue < 1) {
        setError('Quantity must be at least 1');
        return;
      } else {
        setError(''); // Clear error if valid
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#efe5d6] rounded-2xl p-8 w-full max-w-md mx-4">
        <h2 className="text-2xl font-semibold mb-6 text-[#434237]">Request Refund</h2>
        
        <div className="mb-4 p-4 bg-[#BFAF92] rounded-lg">
          <h3 className="font-semibold text-[#434237]">Item Details</h3>
          <p className="text-sm text-gray-700">Order: #{transaction?.transactionId || transaction?.orderId}</p>
          <p className="text-sm text-gray-700">Item: {transaction?.clothesName || transaction?.itemName || transaction?.clothes?.name}</p>
          {transaction?.size && <p className="text-sm text-gray-700">Size: {transaction.size}</p>}
          {transaction?.color && <p className="text-sm text-gray-700">Color: {transaction.color}</p>}
          <p className="text-sm text-gray-700">Unit Price: {(transaction?.unitPrice || transaction?.price)?.toLocaleString('vi-VN')} VND</p>
          <div className="mt-2 text-sm">
            <span className="text-green-600 font-semibold">Available for refund: {maxQuantity} / {transaction?.originalQuantity || transaction?.quantity}</span>
            {transaction?.refundedQuantity > 0 && (
              <span className="text-orange-600 ml-2">({transaction.refundedQuantity} already refunded)</span>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#434237] mb-2">
              Quantity to Refund
            </label>
            <input
              type="number"
              name="quantity"
              min="1"
              max={maxQuantity}
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#434237]"
              required
            />
            <div className="mt-1 text-xs text-gray-600">
              Maximum available for refund: {maxQuantity}
            </div>
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
              disabled={loading || maxQuantity <= 0 || formData.quantity > maxQuantity}
              className="flex-1 py-3 px-4 bg-[#434237] text-white rounded-lg hover:bg-[#2f2e25] transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : maxQuantity <= 0 ? 'No Items Available' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefundModal;