import React, { useState, useEffect } from 'react';
import { IoShareSocialOutline, IoClose, IoSearchOutline, IoChevronForward } from 'react-icons/io5';

import axiosInstance from '../../configs/axiosInstance';
import toast from 'react-hot-toast';

const ShareProductButton = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const [friends, setFriends] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConvs, setSelectedConvs] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
      setConversations(convsRes.data.conversations || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const toggleConversation = (convId) => {
    setSelectedConvs(prev => 
      prev.includes(convId) 
        ? prev.filter(id => id !== convId)
        : [...prev, convId]
    );
  };

  const shareProduct = async () => {
    if (selectedConvs.length === 0) {
      toast.error('Please select at least one friend to share with');
      return;
    }

    setLoading(true);
    try {
      await Promise.all(
        selectedConvs.map(convId =>
          axiosInstance.post('/chat/share-product', {
            conversationId: convId,
            productId: product.id,
            message: message || `Check out this ${product.name}!`
          })
        )
      );

      toast.success(`Product shared with ${selectedConvs.length} friend${selectedConvs.length > 1 ? 's' : ''}!`);
      setShowModal(false);
      setMessage('');
      setSelectedConvs([]);
      setSearchQuery('');
    } catch (error) {
      toast.error('Failed to share product');
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-3 border border-[#434237] text-[#434237] rounded-lg hover:bg-[#434237] hover:text-white transition"
        title="Share with Friends"
      >
        <IoShareSocialOutline className="text-xl" />
      </button>

      {/* Share Modal - Facebook Style */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2c2c2c] rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Share</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-700 rounded-full transition"
              >
                <IoClose className="text-2xl text-gray-300" />
              </button>
            </div>

            {/* User Info & Post Input */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-white font-semibold">You</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Your Feed</p>
                  <button className="flex items-center gap-1 text-xs text-gray-400">
                    <span className="bg-gray-700 px-2 py-0.5 rounded flex items-center gap-1">
                      🔒 Only Me
                    </span>
                  </button>
                </div>
              </div>
              
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Say something about this..."
                rows={3}
                className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none text-sm"
              />
            </div>

            {/* Product Preview */}
            <div className="px-4 py-3 border-b border-gray-700">
              <div className="flex gap-3 items-center bg-gray-800/50 p-3 rounded-lg">
                {product.mainImg && (
                  <img 
                    src={product.mainImg.url} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-sm truncate">{product.name}</h4>
                  <p className="text-xs text-gray-400">{product.price} VND</p>
                </div>
              </div>
            </div>

            {/* Send via Messenger Section */}
            <div className="p-4 bg-[#242424]">
              <div className="flex items-center gap-2 mb-3">
                
                <h4 className="text-white font-semibold">Send via Messenger</h4>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full bg-gray-700 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Friend List */}
              <div className="max-h-64 overflow-y-auto space-y-1 custom-scrollbar">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conv) => {
                    const isSelected = selectedConvs.includes(conv.id);
                    const friend = conv.otherUser;
                    
                    return (
                      <div
                        key={conv.id}
                        onClick={() => toggleConversation(conv.id)}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
                          isSelected ? 'bg-blue-600/20' : 'hover:bg-gray-700'
                        }`}
                      >
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-600 p-0.5">
                            <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center">
                              {friend?.avatar?.url ? (
                                <img 
                                  src={friend.avatar.url} 
                                  alt={friend.name}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                <span className="text-white font-semibold text-sm">
                                  {friend?.name?.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{friend?.name}</p>
                        </div>

                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-500'
                        }`}>
                          {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400 text-sm text-center py-8">
                    {searchQuery ? 'No friends found' : 'No conversations yet'}
                  </p>
                )}
              </div>
            </div>

            {/* Footer Button */}
            <div className="p-4">
              <button
                onClick={shareProduct}
                disabled={selectedConvs.length === 0 || loading}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Sharing...'
                ) : (
                  <>
                    Share Now
                    {selectedConvs.length > 0 && (
                      <span className="bg-blue-700 px-2 py-0.5 rounded-full text-xs">
                        {selectedConvs.length}
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>

          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #1f1f1f;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #555;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #666;
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default ShareProductButton;
