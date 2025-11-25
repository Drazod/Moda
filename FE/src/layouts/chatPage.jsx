

import SideNav from '../components/SideNav';
import CartModal from './cart';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { 
  IoSend, 
  IoArrowBack,
  IoImageOutline,
  IoShareSocialOutline,
  IoPaperPlaneOutline,
  IoCreateOutline,
  IoSearchOutline,
  IoInformationCircleOutline
} from 'react-icons/io5';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../configs/axiosInstance';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = "http://localhost:4000"; // Chat socket URL

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null); // ✅ Store socket in ref to prevent recreation
  const typingTimeoutRef = useRef(null);
  const selectedConversationRef = useRef(null); // ✅ Store selected conversation in ref
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false); // ✅ Typing indicator state
  const [typingUser, setTypingUser] = useState(null); // ✅ Who is typing

  // ✅ Update ref whenever selectedConversation changes
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  // ✅ Initialize Socket.IO connection (only once)
  useEffect(() => {
    if (!user?.id) return;

    // Create socket connection
    socketRef.current = io(SOCKET_URL, {
      query: { userId: user.id },
      transports: ["websocket"],
    });

    // ✅ Listen for new messages
    socketRef.current.on('new-message', ({ conversationId, message }) => {
      console.log('📨 New message received:', message);
      
      // Add message to current conversation if it's selected
      if (selectedConversationRef.current?.id === conversationId) {
        setMessages(prev => {
          // ✅ Prevent duplicates (in case server sends back our own message)
          const exists = prev.some(m => m.id === message.id);
          if (exists) return prev;
          return [...prev, message];
        });
        
        // Auto-mark as read if conversation is open
        markAsRead(conversationId);
      }
      
      // ✅ Update specific conversation instead of fetching all
      updateConversationInList(conversationId, message);
    });

    // ✅ Listen for messages being read
    socketRef.current.on('messages-read', ({ conversationId, readByUserId }) => {
      console.log('✅ Messages marked as read in conversation:', conversationId);
      
      // Update messages in current conversation to mark as read
      if (selectedConversationRef.current?.id === conversationId) {
        setMessages(prev => 
          prev.map(msg => 
            msg.senderId === user.id ? { ...msg, isRead: true } : msg
          )
        );
      }
      
      // Update conversation list unread count
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    });

    // ✅ Listen for typing indicator
    socketRef.current.on('user-typing', ({ conversationId, userId, isTyping }) => {
      if (selectedConversationRef.current?.id === conversationId && userId !== user.id) {
        setIsTyping(isTyping);
        if (isTyping) {
          setTypingUser(userId);
        } else {
          setTypingUser(null);
        }
      }
    });

    // ✅ Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?.id]); // Only re-run if userId changes

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
    
    // Check if friendId is in query params to start a conversation
    const params = new URLSearchParams(location.search);
    const friendId = params.get('friendId');
    if (friendId) {
      createOrOpenConversation(parseInt(friendId));
    }
  }, [location.search]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation?.id]); // Only re-run when conversation ID changes

  // Auto-scroll to bottom when new messages arrive
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

  // ✅ Update a specific conversation in the list (more efficient)
  const updateConversationInList = async (conversationId, lastMessage) => {
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage,
            updatedAt: new Date().toISOString(),
            unreadCount: selectedConversation?.id === conversationId 
              ? 0 
              : (conv.unreadCount || 0) + 1
          };
        }
        return conv;
      });
      
      // Sort by most recent
      return updated.sort((a, b) => 
        new Date(b.updatedAt) - new Date(a.updatedAt)
      );
    });
  };

  const createOrOpenConversation = async (friendId) => {
    try {
      const response = await axiosInstance.post('/chat/conversation', { friendId });
      setSelectedConversation(response.data.conversation);
      
      // Add to conversation list if not exists
      setConversations(prev => {
        const exists = prev.some(c => c.id === response.data.conversation.id);
        if (!exists) {
          return [response.data.conversation, ...prev];
        }
        return prev;
      });
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

      // ✅ Extract message from response.data.data (check your API response structure)
      const newMessage = response.data.data || response.data;
      
      // ✅ Optimistically add message (socket will handle it for receiver)
      setMessages(prev => {
        const exists = prev.some(m => m.id === newMessage.id);
        if (exists) return prev;
        return [...prev, newMessage];
      });
      
      setMessageInput('');
      
      // ✅ Stop typing indicator
      emitTyping(false);
      
      // ✅ Update conversation list locally instead of refetching
      updateConversationInList(selectedConversation.id, newMessage);
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (conversationId) => {
    try {
      await axiosInstance.put(`/chat/messages/read/${conversationId}`);
      
      // Update local state immediately
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );
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

      const newMessage = response.data.data || response.data;
      setMessages(prev => [...prev, newMessage]);
      updateConversationInList(selectedConversation.id, newMessage);
      toast.success('Product shared!');
    } catch (error) {
      toast.error('Failed to share product');
    }
  };

  // ✅ Handle typing indicator
  const handleTyping = (e) => {
    setMessageInput(e.target.value);
    
    if (!socketRef.current || !selectedConversation) return;
    
    // Emit typing event
    emitTyping(true);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(false);
    }, 2000);
  };

  const emitTyping = (isTyping) => {
    if (!socketRef.current || !selectedConversation) return;
    
    const receiverId = selectedConversation.user1Id === user.id 
      ? selectedConversation.user2Id 
      : selectedConversation.user1Id;
    
    socketRef.current.emit('typing', {
      conversationId: selectedConversation.id,
      receiverId,
      isTyping
    });
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
    <div className="flex h-screen relative-container text-[#353535]">
      {/* Side Navigation */}
      <SideNav onCartOpen={() => setCartOpen(true)} />

      {/* Chat Container - adjust margin for collapsed sidebar */}
      <div className="flex-1 ml-20 flex ">
        {/* Left Sidebar - Conversations List */}
        <div className="w-96 border-r-[0.1px] border-[#BFAF92] flex flex-col ">
          {/* Header */}
          <div className="p-4 ">
            <div className="flex items-center justify-between my-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
                <IoCreateOutline className="text-xl cursor-pointer" />
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full bg-[#BFAF92] text-white pl-8 pr-4 py-2 rounded-full  text-sm"
              />
            </div>
          </div>

          {/* Your Note */}
          <div className="px-4 py-2 ">
            <div className="flex items-center gap-3 rounded-lg transition">
              <div className="relative">
                <div className="w-16 h-16 rounded-full flex items-center justify-center">
                  <img className="w-16 h-16 rounded-full object-cover"
                       src={user.avatar?.url} 
                       alt="User Avatar"  
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#FFFFFF] rounded-full flex items-center justify-center text-xs">
                  +
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Your note</p>
              </div>
            </div>
          </div>

          {/* Messages/Requests Tabs */}
          <div className="flex px-4 py-2 items-center ">
            <div className="flex-1 text-lg font-semibold ">
              Messages
            </div>
            <div className=" justify-end text-sm text-gray-400 ">
              Requests
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map((conv) => {
                const friend = conv.otherUser;
                const isSelected = selectedConversation?.id === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`px-4 h-20 py-1 cursor-pointer transition flex items-center ${
                      isSelected ? 'bg-[#BFAF92]/50' : 'hover:bg-[#BFAF92]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-lg font-semibold">
                            {friend?.name?.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-semibold' : ''}`}>
                            {friend?.name}
                          </h3>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {conv.lastMessage && formatTime(conv.lastMessage.createdAt)}
                          </span>
                        </div>
                        {conv.lastMessage && (
                          <p className={`text-sm truncate mt-0.5 ${
                            conv.unreadCount > 0 ? 'font-medium text-white' : 'text-gray-400'
                          }`}>
                            {conv.lastMessage.messageType === 'PRODUCT' 
                              ? '📦 Shared a product' 
                              : `You: ${conv.lastMessage.content}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-400 text-sm">No messages yet</p>
                <button
                  onClick={() => navigate('/friends')}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
                >
                  Find Friends
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b-[0.1px] border-[#BFAF92]  flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold">
                      {selectedConversation.otherUser?.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{selectedConversation.otherUser?.name}</h3>
                  </div>
                </div>
                
                <button className="p-2 hover:bg-gray-900 rounded-full transition">
                  <IoInformationCircleOutline className="text-2xl" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="text-center py-8 text-gray-400">Loading messages...</div>
                ) : messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((msg, index) => {
                      const isOwn = msg.senderId === user?.id;
                      const isLastOwnMessage = isOwn && index === messages.length - 1;
                      
                      return (
                        <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          {!isOwn && (
                            <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs font-semibold mr-2 flex-shrink-0">
                              <img src={selectedConversation.user1?.avatar.url || ""} alt={selectedConversation.user1?.name || "User"} />
                            </div>
                          )}
                          
                          <div className={`max-w-xs`}>
                            {msg.messageType === 'TEXT' && (
                              <div className={`rounded-3xl px-4 py-2 ${
                                isOwn ? 'bg-[#434237] text-white' : 'bg-[#BFAF92]/50 text-black'
                              }`}>
                                <p className="text-sm">{msg.content}</p>
                              </div>
                            )}
                            
                            {msg.messageType === 'PRODUCT' && msg.product && (
                              <div className="border border-gray-700 rounded-2xl p-3 bg-[#1a1a1a] cursor-pointer hover:bg-[#262626] transition"
                                   onClick={() => navigate(`/product?id=${msg.product.id}`)}>
                                <div className="flex gap-3">
                                  {msg.product.mainImg && (
                                    <img 
                                      src={msg.product.mainImg.url} 
                                      alt={msg.product.name}
                                      className="w-16 h-16 object-cover rounded-lg"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm">{msg.product.name}</h4>
                                    <p className="text-sm text-gray-400">{msg.product.price} VND</p>
                                  </div>
                                </div>
                                {msg.content && (
                                  <p className="text-sm text-gray-300 mt-2">{msg.content}</p>
                                )}
                              </div>
                            )}
                            
                            {/* Time and read status for last own message */}
                            {isLastOwnMessage && (
                              <p className="text-xs text-gray-400 mt-1 text-right">
                                {msg.isRead ? 'Seen' : 'Sent'} · {formatTime(msg.createdAt)}
                              </p>
                            )}
                          </div>
                          
                          {isOwn && (
                            <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs font-semibold ml-2 flex-shrink-0">
                              {user?.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs font-semibold mr-2 flex-shrink-0">
                          {selectedConversation.friend?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="bg-[#262626] rounded-3xl px-4 py-2">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 border-2 border-white rounded-full mb-4">
                      <IoPaperPlaneOutline className="text-3xl" />
                    </div>
                    <h3 className="text-xl font-normal mb-2">Your messages</h3>
                    <p className="text-gray-400 text-sm mb-6">Send a message to start a chat.</p>
                    <button
                      onClick={() => setMessageInput('Hello!')}
                      className="px-6 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition"
                    >
                      Send message
                    </button>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-900 rounded-full transition">
                    <IoImageOutline className="text-xl" />
                  </button>
                  
                  <input
                    type="text"
                    value={messageInput}
                    onChange={handleTyping}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Message..."
                    className="flex-1 bg-transparent border border-gray-700 rounded-full px-4 py-2 focus:outline-none text-sm"
                  />
                  
                  {messageInput.trim() ? (
                    <button
                      onClick={sendMessage}
                      disabled={sending}
                      className="text-blue-500 font-semibold text-sm hover:text-blue-400 transition disabled:opacity-50"
                    >
                      Send
                    </button>
                  ) : (
                    <button className="p-2 hover:bg-gray-900 rounded-full transition">
                      <IoShareSocialOutline className="text-xl" />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 border-2 border-white rounded-full mb-6">
                  <IoPaperPlaneOutline className="text-4xl" />
                </div>
                <h3 className="text-2xl font-light mb-2">Your messages</h3>
                <p className="text-gray-400 text-sm mb-6">Send private messages to a friend or group.</p>
                <button
                  onClick={() => navigate('/friends')}
                  className="px-6 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition"
                >
                  Send message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cart Modal */}
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default ChatPage;
