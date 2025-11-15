import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import axiosInstance from '../configs/axiosInstance';
import toast from 'react-hot-toast';
import { 
  IoSend, 
  IoArrowBack,
  IoImageOutline,
  IoShareSocialOutline,
  IoEllipsisVertical
} from 'react-icons/io5';

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchConversations();
    
    // Check if friendId is in query params to start a conversation
    const params = new URLSearchParams(location.search);
    const friendId = params.get('friendId');
    if (friendId) {
      createOrOpenConversation(parseInt(friendId));
    }
  }, [location.search]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await axiosInstance.get('/chat/conversations');
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const createOrOpenConversation = async (friendId) => {
    try {
      const response = await axiosInstance.post('/chat/conversation', { friendId });
      setSelectedConversation(response.data.conversation);
      fetchConversations(); // Refresh conversation list
    } catch (error) {
      toast.error('Failed to open conversation');
    }
  };

  const fetchMessages = async (conversationId, before = null) => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (before) params.before = before;
      const response = await axiosInstance.get(`/chat/messages/${conversationId}`, { params });
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const response = await axiosInstance.post('/chat/message', {
        conversationId: selectedConversation.id,
        content: messageInput,
        messageType: 'TEXT'
      });

      // Add new message to list
      setMessages(prev => [...prev, response.data]);
      setMessageInput('');
      fetchConversations(); // Update conversation list with new message
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (conversationId) => {
    try {
      await axiosInstance.put(`/chat/messages/read/${conversationId}`);
      fetchConversations(); // Update unread count
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const shareProduct = async (productId) => {
    if (!selectedConversation) return;

    try {
      const response = await axiosInstance.post('/chat/share-product', {
        conversationId: selectedConversation.id,
        productId,
        message: `Check out this product!`
      });

      setMessages(prev => [...prev, response.data]);
      toast.success('Product shared!');
    } catch (error) {
      toast.error('Failed to share product');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-[#434237]">Messages</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {conversations.length > 0 ? (
                  conversations.map((conv) => {
                    const friend = conv.friend;
                    const isSelected = selectedConversation?.id === conv.id;
                    
                    return (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv)}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                          isSelected ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600">
                              {friend?.name?.charAt(0).toUpperCase()}
                            </div>
                            {conv.unreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-[#434237] truncate">{friend?.name}</h3>
                              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                {conv.lastMessage && formatTime(conv.lastMessage.createdAt)}
                              </span>
                            </div>
                            {conv.lastMessage && (
                              <p className={`text-sm truncate mt-1 ${
                                conv.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'
                              }`}>
                                {conv.lastMessage.messageType === 'PRODUCT' ? '📦 Product' : conv.lastMessage.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>No conversations yet</p>
                    <button
                      onClick={() => navigate('/friends')}
                      className="mt-4 px-4 py-2 bg-[#434237] text-white rounded-lg hover:bg-[#353535] transition"
                    >
                      Find Friends
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600">
                        {selectedConversation.friend?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#434237]">{selectedConversation.friend?.name}</h3>
                        <p className="text-xs text-gray-500">Active now</p>
                      </div>
                    </div>
                    
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                      <IoEllipsisVertical className="text-gray-600" />
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">Loading messages...</div>
                    ) : messages.length > 0 ? (
                      messages.map((msg) => {
                        const isOwn = msg.senderId === msg.sender?.id; // Adjust based on your user context
                        
                        return (
                          <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                              {msg.messageType === 'TEXT' && (
                                <div className={`rounded-lg px-4 py-2 ${
                                  isOwn ? 'bg-[#434237] text-white' : 'bg-gray-200 text-gray-900'
                                }`}>
                                  <p>{msg.content}</p>
                                </div>
                              )}
                              
                              {msg.messageType === 'PRODUCT' && msg.product && (
                                <div className="border border-gray-300 rounded-lg p-3 bg-white cursor-pointer hover:shadow-md transition"
                                     onClick={() => navigate(`/product?id=${msg.product.id}`)}>
                                  <div className="flex gap-3">
                                    {msg.product.mainImg && (
                                      <img 
                                        src={msg.product.mainImg.url} 
                                        alt={msg.product.name}
                                        className="w-16 h-16 object-cover rounded"
                                      />
                                    )}
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-sm text-[#434237]">{msg.product.name}</h4>
                                      <p className="text-sm text-gray-600">{msg.product.price} VND</p>
                                    </div>
                                  </div>
                                  {msg.content && (
                                    <p className="text-sm text-gray-600 mt-2">{msg.content}</p>
                                  )}
                                </div>
                              )}
                              
                              <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                                {formatTime(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No messages yet. Start the conversation!
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <button className="p-3 hover:bg-gray-100 rounded-full transition">
                        <IoImageOutline className="text-gray-600 text-xl" />
                      </button>
                      
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#434237]"
                      />
                      
                      <button
                        onClick={sendMessage}
                        disabled={!messageInput.trim() || sending}
                        className="px-6 py-2 bg-[#434237] text-white rounded-full hover:bg-[#353535] transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <IoSend />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p className="text-lg">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChatPage;
