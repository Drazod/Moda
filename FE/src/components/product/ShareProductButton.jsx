import React, { useState, useEffect } from 'react';
import { IoShareSocialOutline, IoClose } from 'react-icons/io5';
import axiosInstance from '../../configs/axiosInstance';
import toast from 'react-hot-toast';

const ShareProductButton = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const [friends, setFriends] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showModal) {
      fetchFriendsAndConversations();
    }
  }, [showModal]);

  const fetchFriendsAndConversations = async () => {
    try {
      const [friendsRes, convsRes] = await Promise.all([
        axiosInstance.get('/friendship/friends'),
        axiosInstance.get('/chat/conversations')
      ]);
      setFriends(friendsRes.data || []);
      setConversations(convsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const shareProduct = async () => {
    if (!selectedConv) {
      toast.error('Please select a friend to share with');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/chat/share-product', {
        conversationId: selectedConv,
        productId: product.id,
        message: message || `Check out this ${product.name}!`
      });

      toast.success('Product shared successfully!');
      setShowModal(false);
      setMessage('');
      setSelectedConv(null);
    } catch (error) {
      toast.error('Failed to share product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 border border-[#434237] text-[#434237] rounded-lg hover:bg-[#434237] hover:text-white transition"
      >
        <IoShareSocialOutline className="text-xl" />
        Share with Friends
      </button>

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#434237]">Share Product</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition"
              >
                <IoClose className="text-2xl text-gray-600" />
              </button>
            </div>

            {/* Product Preview */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-3">
                {product.mainImg && (
                  <img 
                    src={product.mainImg.url} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-[#434237]">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.price} VND</p>
                </div>
              </div>
            </div>

            {/* Friend Selection */}
            <div className="flex-1 overflow-y-auto p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Friend
              </label>
              
              {conversations.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConv(conv.id)}
                      className={`p-3 border rounded-lg cursor-pointer transition ${
                        selectedConv === conv.id
                          ? 'border-[#434237] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                          {conv.friend?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#434237]">{conv.friend?.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm mb-4">
                  No conversations yet. Start a chat with friends first!
                </p>
              )}

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="I think you'll love this!"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#434237] resize-none"
              />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={shareProduct}
                disabled={!selectedConv || loading}
                className="flex-1 px-4 py-2 bg-[#434237] text-white rounded-lg hover:bg-[#353535] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sharing...' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareProductButton;
