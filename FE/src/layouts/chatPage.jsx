import SideNav from '../components/SideNav';
import CartModal from './cart';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { 
  IoShareSocialOutline,
  IoImageOutline,
  IoPaperPlaneOutline,
  IoCreateOutline,
  IoSearchOutline,
  IoInformationCircleOutline,
  IoShieldCheckmarkOutline,
  IoWarningOutline
} from 'react-icons/io5';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../configs/axiosInstance';
import { useAuth } from '../context/AuthContext';
import {
  generateKeyPair,
  exportPublicKey,
  exportPrivateKey,
  importPublicKey,
  importPrivateKey,
  encryptMessageAES,
  decryptMessageAES,
  decryptMessageWithAESKey,
  encryptPrivateKeyForBackup,
  decryptPrivateKeyFromBackup,
  storeKeysSecurely,
  retrieveStoredKeys,
  retrieveKeysFromServer,
  hasStoredKeys,
  verifyPin,
  getDeviceIdentifier
} from '../utils/encryption';

const SOCKET_URL = "http://localhost:4000";

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const selectedConversationRef = useRef(null);
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  
  const [hasKeys, setHasKeys] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [encryptionStatus, setEncryptionStatus] = useState('initializing');
  const [friendPublicKeys, setFriendPublicKeys] = useState({});
  
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    if (user?.id && !hasKeys) {
      checkEncryptionStatus();
    }
  }, [user?.id, hasKeys]);

  const checkEncryptionStatus = async () => {
    try {
      // Step 1: Check localStorage
      const hasLocal = hasStoredKeys();
      
      // Step 2: Check IndexedDB
      let hasIndexedDB = false;
      try {
        const db = await indexedDB.open('ModaChatEncryption', 1);
        const transaction = db.transaction(['keys'], 'readonly');
        const store = transaction.objectStore('keys');
        const privateKey = await new Promise((resolve, reject) => {
          const request = store.get('privateKey');
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        hasIndexedDB = !!privateKey;
      } catch (dbError) {
        console.log('IndexedDB check failed:', dbError);
      }
      
      // Step 3: Check server
      let hasServer = false;
      try {
        const response = await axiosInstance.get('/chat/encrypted-keys');
        hasServer = !!(response.data?.encryptedPrivateKey && response.data?.privateKeyIV);
      } catch (serverError) {
        console.log('Server check failed:', serverError);
      }
      
      console.log('🔍 Encryption status:', { hasLocal, hasIndexedDB, hasServer });
      
      // Decide what to do
      if (hasLocal || hasIndexedDB || hasServer) {
        // Keys exist somewhere, ask for PIN to unlock
        setShowPinModal(true);
        setIsSettingPin(false);
      } else {
        // No keys anywhere, need to set up new encryption
        setShowPinModal(true);
        setIsSettingPin(true);
      }
    } catch (error) {
      console.error('Failed to check encryption status:', error);
      // Default to setup mode on error
      setShowPinModal(true);
      setIsSettingPin(true);
    }
  };

  const handlePinSubmit = async () => {
    setPinError('');
    
    // Trim PIN to remove any accidental whitespace
    const trimmedPin = pinInput.trim();
    
    if (isSettingPin) {
      if (trimmedPin.length < 4) {
        setPinError('PIN must be at least 4 digits');
        return;
      }
      if (trimmedPin !== confirmPin.trim()) {
        setPinError('PINs do not match');
        return;
      }
      await setupEncryptionWithPin(trimmedPin);
    } else {
      // Check if we have a local token
      const hasLocalToken = localStorage.getItem('chat_pin_token');
      
      if (hasLocalToken) {
        // Verify PIN against local token
        const isValid = await verifyPin(trimmedPin);
        if (!isValid) {
          setPinError('Incorrect PIN');
          return;
        }
      }
      // If no local token OR token verified, try to load keys (will fetch from server if needed)
      await loadEncryptionKeys(trimmedPin);
    }
  };

  const setupEncryptionWithPin = async (pin) => {
    setEncryptionStatus('initializing');
    
    try {
      const { publicKey: newPublicKey, privateKey: newPrivateKey } = await generateKeyPair();
      const publicKeyPem = await exportPublicKey(newPublicKey);
      
      // Export private key for server backup (encrypted with PIN)
      const privateKeyPem = await exportPrivateKey(newPrivateKey);
      const { encryptedPrivateKey, iv } = await encryptPrivateKeyForBackup(privateKeyPem, pin);
      
      // Store non-extractable private key in IndexedDB locally
      await storeKeysSecurely(publicKeyPem, newPrivateKey, pin);
      
      // Upload public key + encrypted private key to server
      await axiosInstance.post('/chat/setup-encryption', {
        publicKey: publicKeyPem,
        encryptedPrivateKey: encryptedPrivateKey,
        privateKeyIV: iv,
        deviceId: getDeviceIdentifier()
      });
      
      setPublicKey(newPublicKey);
      setPrivateKey(newPrivateKey);
      setHasKeys(true);
      setEncryptionStatus('ready');
      setShowPinModal(false);
      setPinInput('');
      setConfirmPin('');
      toast.success('🔐 Secure messaging enabled');
    } catch (error) {
      console.error('Encryption setup failed:', error);
      setEncryptionStatus('error');
      setPinError('Failed to setup encryption');
    }
  };

  const loadEncryptionKeys = async (pin) => {
    setEncryptionStatus('initializing');
    
    // Check if we have local storage token
    const hasLocal = hasStoredKeys();
    
    if (hasLocal) {
      // We have localStorage token, use it to verify PIN locally
      try {
        const storedKeys = await retrieveStoredKeys(pin);
        
        if (storedKeys.publicKeyPem && storedKeys.privateKey) {
          const importedPublicKey = await importPublicKey(storedKeys.publicKeyPem);
          
          setPublicKey(importedPublicKey);
          setPrivateKey(storedKeys.privateKey);
          setHasKeys(true);
          setEncryptionStatus('ready');
          setShowPinModal(false);
          setPinInput('');
          console.log('✅ Keys loaded from local storage');
          return;
        }
      } catch (localError) {
        console.log('❌ Local PIN verification failed:', localError.message);
        setPinError('Incorrect PIN');
        setEncryptionStatus('error');
        return;
      }
    }
    
    // No local token yet - retrieve from server
    // PIN will be verified by attempting to decrypt the server backup
    // If decryption succeeds = PIN correct, then we create the token
    try {
      console.log('📡 No local token, fetching encrypted keys from server...');
      const response = await axiosInstance.get('/chat/encrypted-keys');
      const serverKeys = response.data;
      
      console.log('📦 Server keys:', { 
        hasEncryptedKey: !!serverKeys.encryptedPrivateKey, 
        hasIV: !!serverKeys.privateKeyIV,
        hasPublicKey: !!serverKeys.publicKey 
      });
      
      if (serverKeys.encryptedPrivateKey && serverKeys.privateKeyIV) {
        const serverData = {
          encryptedPrivateKey: serverKeys.encryptedPrivateKey,
          iv: serverKeys.privateKeyIV,
          publicKey: serverKeys.publicKey
        };
        
        console.log('🔓 Decrypting server backup with your PIN...');
        console.log('Server encrypted key preview:', serverKeys.encryptedPrivateKey.substring(0, 50) + '...');
        console.log('Server IV preview:', serverKeys.privateKeyIV.substring(0, 20) + '...');
        
        // retrieveKeysFromServer will:
        // 1. Decrypt with PIN (if wrong PIN, decryption fails = PIN verification)
        // 2. Store private key in IndexedDB as non-extractable
        // 3. CREATE localStorage token (for future fast PIN verification)
        const restoredKeys = await retrieveKeysFromServer(serverData, pin);
        const importedPublicKey = await importPublicKey(restoredKeys.publicKeyPem);
        
        setPublicKey(importedPublicKey);
        setPrivateKey(restoredKeys.privateKey);
        setHasKeys(true);
        setEncryptionStatus('ready');
        setShowPinModal(false);
        setPinInput('');
        toast.success('🔐 Keys restored from server');
        console.log('✅ Token created in localStorage for future use');
      } else {
        throw new Error('No keys found on server');
      }
    } catch (serverError) {
      console.error('❌ Failed to retrieve from server:', serverError);
      setPinError('Incorrect PIN or no encryption keys found');
      setEncryptionStatus('error');
    }
  };

  useEffect(() => {
    if (selectedConversation && hasKeys) {
      fetchFriendPublicKey(selectedConversation);
    }
  }, [selectedConversation?.id, hasKeys]);

  const fetchFriendPublicKey = async (conversation) => {
    try {
      const friendId = conversation.otherUser?.id;
      
      if (friendPublicKeys[friendId]) return;
      
      const response = await axiosInstance.get(`/chat/public-key/${friendId}`);
      const friendPublicKeyPem = response.data.publicKey;
      
      if (!friendPublicKeyPem) return;
      
      const friendPublicKey = await importPublicKey(friendPublicKeyPem);
      setFriendPublicKeys(prev => ({ ...prev, [friendId]: friendPublicKey }));
    } catch (error) {
      console.error('Failed to fetch friend public key:', error);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    socketRef.current = io(SOCKET_URL, {
      query: { userId: user.id },
      transports: ["websocket"],
    });

    socketRef.current.on('new-message', async ({ conversationId, message }) => {
      // Wait for decryption to complete before adding to state
  
      console.log('🔔 New message received:', decryptedMessage);
      if (selectedConversationRef.current?.id === conversationId) {
        setMessages(prev => {
          const exists = prev.some(m => m.id === decryptedMessage.id);
          if (exists) return prev;
          return [...prev, decryptedMessage];
        });
        markAsRead(conversationId);
      }
      
      updateConversationInList(conversationId, decryptedMessage);
    });

    socketRef.current.on('messages-read', ({ conversationId }) => {
      if (selectedConversationRef.current?.id === conversationId) {
        setMessages(prev => 
          prev.map(msg => 
            msg.senderId === user.id ? { ...msg, isRead: true } : msg
          )
        );
      }
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    });

    socketRef.current.on('user-typing', ({ conversationId, userId, isTyping }) => {
      if (selectedConversationRef.current?.id === conversationId && userId !== user.id) {
        setIsTyping(isTyping);
        setTypingUser(isTyping ? userId : null);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?.id]);

  const decryptIncomingMessage = async (message) => {
    if (!message.isEncrypted || !privateKey) return message;

    try {
      const isSender = message.senderId === user.id;
      let decryptedContent;
      
      if (isSender && message.aesKey) {
        decryptedContent = await decryptMessageWithAESKey(
          message.encryptedContent,
          message.iv,
          message.aesKey
        );
      } else if (message.encryptedAESKey) {
        decryptedContent = await decryptMessageAES(
          message.encryptedContent,
          message.iv,
          message.encryptedAESKey,
          privateKey
        );
      } else {
        throw new Error('Missing encryption data');
      }
      
      // Ensure content is not empty
      if (!decryptedContent || decryptedContent.trim() === '') {
        console.error('Decryption returned empty content for message:', message.id);
        return { ...message, content: '[Decryption error: empty content]', isEncrypted: true };
      }
      
      return { ...message, content: decryptedContent, isEncrypted: true };
    } catch (error) {
      console.error('Message decryption failed:', error);
      return { ...message, content: '[Unable to decrypt]', isEncrypted: true };
    }
  };

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

  const updateConversationInList = (conversationId, lastMessage) => {
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
      return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
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
      const encryptedMessages = response.data.messages || [];
      
      // 🔐 Decrypt messages if they are encrypted (AES hybrid)
      if (privateKey) {
        const decryptedMessages = await Promise.all(
          encryptedMessages.map(async (msg) => {
            if (msg.isEncrypted) {
              try {
                let decryptedContent;
                
                // Check if sender or receiver
                const isSender = msg.senderId === user.id;
                
                if (isSender && msg.aesKey) {
                  // Sender: decrypt with plain AES key
                  decryptedContent = await decryptMessageWithAESKey(
                    msg.encryptedContent,
                    msg.iv,
                    msg.aesKey
                  );
                } else if (msg.encryptedAESKey) {
                  // Receiver: decrypt AES key with private key, then decrypt message
                  decryptedContent = await decryptMessageAES(
                    msg.encryptedContent,
                    msg.iv,
                    msg.encryptedAESKey,
                    privateKey
                  );
                } else {
                  throw new Error('Missing encryption data');
                }
                
                return {
                  ...msg,
                  content: decryptedContent,
                  isEncrypted: true
                };
              } catch (error) {
                console.error('❌ Failed to decrypt message:', msg.id, error);
                return {
                  ...msg,
                  content: '[Encrypted - Unable to decrypt]',
                  isEncrypted: true
                };
              }
            }
            return msg;
          })
        );
        setMessages(decryptedMessages);
      } else {
        setMessages(encryptedMessages);
      }
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
      const friendId = selectedConversation.otherUser?.id;
      const friendPublicKey = friendPublicKeys[friendId];
      
      let messageData = {
        conversationId: selectedConversation.id,
        content: messageInput,
        messageType: 'TEXT'
      };

      if (friendPublicKey && hasKeys && privateKey) {
        try {
          const encrypted = await encryptMessageAES(messageInput, privateKey, friendPublicKey);
          messageData = {
            ...messageData,
            content: '',
            encryptedContent: encrypted.encryptedContent,
            iv: encrypted.iv,
            encryptedAESKey: encrypted.encryptedAESKey,
            aesKey: encrypted.aesKey,
            isEncrypted: true
          };
        } catch (error) {
          console.error('Encryption failed:', error);
          toast.error('Failed to encrypt message');
        }
      }

      const response = await axiosInstance.post('/chat/message', messageData);
      let newMessage = response.data.data || response.data;
      
      if (newMessage.isEncrypted && messageInput) {
        newMessage = { ...newMessage, content: messageInput, isEncrypted: true };
      }
      
      setMessages(prev => {
        const exists = prev.some(m => m.id === newMessage.id);
        if (exists) return prev;
        return [...prev, newMessage];
      });
      
      setMessageInput('');
      emitTyping(false);
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
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };


  const handleTyping = (e) => {
    setMessageInput(e.target.value);
    if (!socketRef.current || !selectedConversation) return;
    
    emitTyping(true);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => emitTyping(false), 2000);
  };

  const emitTyping = (isTyping) => {
    if (!socketRef.current || !selectedConversation) return;
    
    const receiverId = selectedConversation.otherUser?.id
    
    socketRef.current.emit('typing', {
      conversationId: selectedConversation.otherUser?.id,
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
      <SideNav onCartOpen={() => setCartOpen(true)} />

      {showPinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#434237] rounded-full flex items-center justify-center mx-auto mb-4">
                <IoShieldCheckmarkOutline className="text-3xl text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {isSettingPin ? 'Set Up PIN' : 'Enter PIN'}
              </h2>
              <p className="text-gray-600">
                {isSettingPin 
                  ? 'Create a PIN to protect your encryption keys' 
                  : 'Enter your PIN to access encrypted messages'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isSettingPin ? 'Create PIN' : 'PIN'}
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePinSubmit()}
                  placeholder="Enter PIN"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#434237]"
                  maxLength={6}
                  autoFocus
                />
              </div>

              {isSettingPin && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confirm PIN
                  </label>
                  <input
                    type="password"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePinSubmit()}
                    placeholder="Confirm PIN"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#434237]"
                    maxLength={6}
                  />
                </div>
              )}

              {pinError && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <IoWarningOutline />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                onClick={handlePinSubmit}
                disabled={!pinInput || (isSettingPin && !confirmPin)}
                className="w-full bg-[#434237] text-white py-3 rounded-lg font-medium hover:bg-[#5a594f] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSettingPin ? 'Set PIN' : 'Unlock'}
              </button>

              {isSettingPin && (
                <p className="text-xs text-gray-500 text-center">
                  ⚠️ Remember this PIN. You'll need it to access your messages.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 ml-20 flex ">
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
                console.log(friend)
                const isSelected = selectedConversation?.otherUser?.id === friend?.id;
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
                          <span className="absolute -bottom-1 -right-1 bg-[#434237] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
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
                  className="mt-4 px-4 py-2 bg-[#434237] text-white text-sm rounded-lg hover:bg-[#5a594f] transition"
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
                    {/* 🔐 Encryption Status */}
                    {encryptionStatus === 'ready' && (
                      <div className="flex items-center gap-1 text-xs text-green-500">
                        <IoShieldCheckmarkOutline className="text-sm" />
                        <span>End-to-end encrypted</span>
                      </div>
                    )}
                    {encryptionStatus === 'error' && (
                      <div className="flex items-center gap-1 text-xs text-red-500">
                        <IoWarningOutline className="text-sm" />
                        <span>Encryption unavailable</span>
                      </div>
                    )}
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
                              <img src={selectedConversation.otherUser?.avatar?.url || ""} alt={selectedConversation.otherUser?.name || "User"} />
                            </div>
                          )}
                          
                          <div className={`max-w-xs`}>
                            {msg.messageType === 'TEXT' && (
                              <div className={`rounded-3xl px-4 py-2 ${
                                isOwn ? 'bg-[#434237] text-white' : 'bg-[#BFAF92]/50 text-black'
                              }`}>
                                <p className="text-sm">{msg.content}</p>
                                {/* 🔐 Encryption indicator */}
                                {msg.isEncrypted && (
                                  <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
                                    <IoShieldCheckmarkOutline className="text-xs" />
                                    <span>Encrypted</span>
                                  </div>
                                )}
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
                      className="px-6 py-2 bg-[#434237] text-white text-sm font-semibold rounded-lg hover:bg-[#5a594f] transition"
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
                      className="text-[#434237] font-semibold text-sm hover:text-[#5a594f] transition disabled:opacity-50"
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
                  className="px-6 py-2 bg-[#434237] text-white text-sm font-semibold rounded-lg hover:bg-[#5a594f] transition"
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
