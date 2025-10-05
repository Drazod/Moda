import React, { useState } from 'react';
import { FaTimes, FaStar } from 'react-icons/fa';
import axiosInstance from '../../configs/axiosInstance';

const CommentModal = ({ transaction, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!formData.content.trim()) {
      setError('Please enter your review');
      setLoading(false);
      return;
    }
    
    try {
      await onSubmit({
        transactionDetailId: transaction.transactionDetailId || transaction.id,
        content: formData.content.trim(),
        rating: formData.rating
      });
      // Success handled by parent component (modal will close)
      setLoading(false);
    } catch (error) {
      console.error('Comment submission error:', error);
      setError(error.response?.data?.message || 'Failed to submit review');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStarClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#efe5d6] rounded-2xl p-8 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#434237]">Write a Review</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="mb-4 p-4 bg-[#BFAF92] rounded-lg">
          <h3 className="font-semibold text-[#434237]">Item Details</h3>
          <p className="text-sm text-gray-700">Order: #{transaction?.transactionId || transaction?.orderId}</p>
          <p className="text-sm text-gray-700">Item: {transaction?.clothesName || transaction?.itemName || transaction?.clothes?.name}</p>
          {transaction?.size && <p className="text-sm text-gray-700">Size: {transaction.size}</p>}
          <p className="text-sm text-gray-700">Quantity: {transaction?.originalQuantity || transaction?.quantity}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#434237] mb-2">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="text-2xl transition-colors hover:scale-110"
                >
                  <FaStar 
                    className={star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#434237] mb-2">
              Your Review
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="5"
              className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#434237] resize-none"
              placeholder="Share your experience with this product..."
              required
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.content.length}/500 characters
            </div>
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
              disabled={loading || !formData.content.trim()}
              className="flex-1 py-3 px-4 bg-[#434237] text-white rounded-lg hover:bg-[#2f2e25] transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;