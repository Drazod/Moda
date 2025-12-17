// ============================================================================
// IMPORTS
// ============================================================================
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { 
  IoShareSocialOutline,
  IoImageOutline,
  IoPaperPlaneOutline,
  IoCreateOutline,
  IoSearchOutline,
  IoInformationCircleOutline,
  IoShieldCheckmarkOutline,
  IoWarningOutline,
  IoDownloadOutline,
  IoCopyOutline,
  IoPrintOutline,
  IoCheckmarkCircleOutline,
  IoCloseOutline
} from 'react-icons/io5';

import SideNav from '../components/SideNav';
import CartModal from './cart';
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
  storeKeysSecurely,
  retrieveStoredKeys,
  hasStoredKeys,
  verifyPin,
  getDeviceIdentifier,
  generateRecoveryCodes,
  createEnvelopeEncryption,
  decryptPrivateKeyWithPin,
  recoverWithCode
} from '../utils/encryption';

// ============================================================================
// CONSTANTS
// ============================================================================
const SOCKET_URL = "https://moda-production.up.railway.app";

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const ChatPage = () => {
  // ============================================================================
  // HOOKS & REFS
  // ============================================================================
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const selectedConversationRef = useRef(null);

  // ============================================================================
  // STATE - CHAT
  // ============================================================================
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  
  // ============================================================================
  // STATE - UI
  // ============================================================================
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  
  // ============================================================================
  // STATE - ENCRYPTION
  // ============================================================================
  const [hasKeys, setHasKeys] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [encryptionStatus, setEncryptionStatus] = useState('initializing');
  const [friendPublicKeys, setFriendPublicKeys] = useState({});
  
  // ============================================================================
  // STATE - PIN MODAL
  // ============================================================================
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');
  
  // ============================================================================
  // STATE - RECOVERY CODES
  // ============================================================================
  const [showRecoveryCodesModal, setShowRecoveryCodesModal] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [hasConfirmedBackup, setHasConfirmedBackup] = useState(false);
  const [showForgotPinModal, setShowForgotPinModal] = useState(false);
  const [recoveryCodeInput, setRecoveryCodeInput] = useState('');
  const [recoveryError, setRecoveryError] = useState('');

  // ============================================================================
  // EFFECTS - INITIALIZATION
  // ============================================================================
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    if (user?.id && !hasKeys) {
      checkEncryptionStatus();
    } else {
      console.log('Skipped checkEncryptionStatus:', { 
        reason: !user?.id ? 'No user' : 'Already has keys' 
      });
    }
  }, [user?.id, hasKeys]);

  useEffect(() => {
    if (selectedConversation && hasKeys && selectedConversation.otherUser?.id) {
      const friendId = selectedConversation.otherUser.id;
      console.log('🔑 Fetching public key for friend:', friendId);
      fetchFriendPublicKey(selectedConversation);
    }
  }, [selectedConversation?.id, hasKeys]);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
    const params = new URLSearchParams(location.search);
    const friendId = params.get('friendId');
    if (friendId) {
      createOrOpenConversation(parseInt(friendId));
    }
  }, [location.search]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      setMessages([]); // Clear messages when switching conversations
      fetchMessages(selectedConversation.id);
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation?.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ============================================================================
  // ENCRYPTION - STATUS CHECK
  // ============================================================================
  const checkEncryptionStatus = async () => {
    console.log('🔍 checkEncryptionStatus called');
    try {
      // Step 1: Check localStorage
      const hasLocal = hasStoredKeys();
      
      // Step 2: Check IndexedDB
      let hasIndexedDB = false;
      try {
        const db = await new Promise((resolve, reject) => {
          // Don't specify version
          const request = indexedDB.open('ModaChatEncryption');
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
          request.onupgradeneeded = (event) => {
            // Database doesn't exist yet, so no keys stored
            reject(new Error('Database not initialized'));
          };
        });
        
        // Check if the object store exists
        if (!db.objectStoreNames.contains('keys')) {
          console.log('IndexedDB: keys object store does not exist');
          db.close();
        } else {
          const transaction = db.transaction(['keys'], 'readonly');
          const store = transaction.objectStore('keys');
          const privateKey = await new Promise((resolve, reject) => {
            const request = store.get('privateKey');
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          });
          
          hasIndexedDB = !!privateKey;
          console.log('IndexedDB: privateKey found =', hasIndexedDB);
          db.close();
        }
      } catch (dbError) {
        console.log('IndexedDB check failed:', dbError.message || dbError);
      }
      
      // Step 3: Check if server has encryption keys
      let serverHasKeys = false;
      try {
        console.log('🔍 Checking server for encryption keys...');
        const keysResponse = await axiosInstance.get('/chat/encrypted-keys');
        serverHasKeys = !!(keysResponse.data.encryptedPrivateKey && keysResponse.data.privateKeyIV);
      } catch (serverError) {
        console.log('Server keys check failed:', serverError);
      }
      
      // Step 4: Check if current device is trusted
      let isDeviceTrusted = false;
      try {
        const currentDeviceId = getDeviceIdentifier();
        const currentFingerprint = currentDeviceId.match(/\[(.*?)\]/)?.[1];
        
        const devicesResponse = await axiosInstance.get('/devices');
        const devices = devicesResponse.data.devices || [];
        
        // Check if current device fingerprint matches any registered device
        const matchedDevice = devices.find((device) => {
          // Extract fingerprint from device name if it contains one
          const deviceFingerprint = device.name.match(/\[(.*?)\]/)?.[1];
          return deviceFingerprint === currentFingerprint;
        });
        
        isDeviceTrusted = !!matchedDevice;
        
        if (matchedDevice) {
          // Update device activity
          await axiosInstance.put(`/devices/${encodeURIComponent(matchedDevice.name)}/activity`);
          console.log('Device activity updated');
        } else {
          console.log('Device not registered');
        }
      } catch (deviceError) {
        console.log('Device registration check failed:', deviceError);
      }
      
      console.log('🔍 Encryption status:', { 
        hasLocal, 
        hasIndexedDB, 
        isDeviceTrusted,
        serverHasKeys 
      });
      
      // If device is trusted and has local keys, auto-load without PIN
      if (isDeviceTrusted && (hasLocal || hasIndexedDB)) {
        try {
          // Try to load keys from localStorage or IndexedDB
          const storedPublicKey = localStorage.getItem('chat_public_key');
          if (storedPublicKey && hasIndexedDB) {
            const db = await new Promise((resolve, reject) => {
              const request = indexedDB.open('ModaChatEncryption');
              request.onsuccess = () => resolve(request.result);
              request.onerror = () => reject(request.error);
            });
            
            const transaction = db.transaction(['keys'], 'readonly');
            const store = transaction.objectStore('keys');
            const privateKey = await new Promise((resolve, reject) => {
              const request = store.get('privateKey');
              request.onsuccess = () => resolve(request.result);
              request.onerror = () => reject(request.error);
            });
            
            if (privateKey) {
              const importedPublicKey = await importPublicKey(storedPublicKey);
              setPublicKey(importedPublicKey);
              setPrivateKey(privateKey);
              setHasKeys(true);
              setEncryptionStatus('ready')
              db.close();
              return;
            }
            db.close();
          }
        } catch (autoLoadError) {
          console.error('Auto-load failed:', autoLoadError);
        }
      }
      
      if (hasLocal || hasIndexedDB || serverHasKeys) {
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

  // ============================================================================
  // ENCRYPTION - PIN HANDLING
  // ============================================================================
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

  // ============================================================================
  // ENCRYPTION - SETUP & LOADING
  // ============================================================================
  const setupEncryptionWithPin = async (pin) => {
    setEncryptionStatus('initializing');
    
    try {
      // Check if we're recovering (keys already exist)
      const isRecovery = hasKeys && publicKey && privateKey;
      
      let newPublicKey, newPrivateKey, publicKeyPem, privateKeyPem;
      
      if (isRecovery) {
        // Re-encrypting existing keys with new PIN
        console.log('🔄 Re-encrypting existing keys with new PIN');
        newPublicKey = publicKey;
        newPrivateKey = privateKey;
        publicKeyPem = await exportPublicKey(publicKey);
        privateKeyPem = await exportPrivateKey(privateKey);
      } else {
        // Creating new keys
        console.log('🆕 Creating new encryption keys');
        const keyPair = await generateKeyPair();
        newPublicKey = keyPair.publicKey;
        newPrivateKey = keyPair.privateKey;
        publicKeyPem = await exportPublicKey(newPublicKey);
        privateKeyPem = await exportPrivateKey(newPrivateKey);
      }
      
      // Generate recovery codes first
      const codes = generateRecoveryCodes();
      setRecoveryCodes(codes);
      
      // Create envelope encryption: encrypt private key with master key,
      // wrap master key with PIN and all recovery codes
      const envelopeData = await createEnvelopeEncryption(privateKeyPem, pin, codes);
      console.log('✅ Envelope encryption created');
      
      // Store non-extractable private key in IndexedDB locally
      await storeKeysSecurely(publicKeyPem, newPrivateKey, pin);
      
      const currentDeviceId = getDeviceIdentifier();
      
      // Upload envelope encryption data to server
      await axiosInstance.post('/chat/setup-encryption', {
        publicKey: publicKeyPem,
        encryptedPrivateKey: envelopeData.encryptedPrivateKey,
        privateKeyIV: envelopeData.privateKeyIV,
        masterKeyWrappedByPin: envelopeData.masterKeyWrappedByPin,
        pinWrapIV: envelopeData.pinWrapIV,
        recoveryCodeWraps: envelopeData.recoveryCodeWraps
      });
      console.log('✅ Envelope encryption uploaded to server');
      
      // Register current device
      try {
        await axiosInstance.post('/devices', {
          deviceName: currentDeviceId,
          userAgent: navigator.userAgent
        });
        console.log('✅ Device registered:', currentDeviceId);
      } catch (deviceError) {
        console.warn('Failed to register device:', deviceError);
        // Continue even if device registration fails
      }
      
      // Show recovery codes modal
      setShowPinModal(false);
      setShowRecoveryCodesModal(true);
      setPinInput('');
      setConfirmPin('');
      
      // Store keys
      setPublicKey(newPublicKey);
      setPrivateKey(newPrivateKey);
      setHasKeys(true);
      setEncryptionStatus('ready');
      
      if (isRecovery) {
        toast.success('🔐 New PIN set successfully');
      }
    } catch (error) {
      console.error('Encryption setup failed:', error);
      setEncryptionStatus('error');
      setPinError('Failed to setup encryption');
    }
  };

  const loadEncryptionKeys = async (pin) => {
    setEncryptionStatus('initializing');
    const hasLocal = hasStoredKeys(); 
    
    console.log('📋 Local storage check:', { hasLocal });
    
    // Only use local verification if we have the PIN token
    // If only public key exists without token, fall through to server
    if (hasLocal) {
      console.log('🔐 Attempting local PIN verification...');
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
          
          // Register device if not already registered
          try {
            const currentDeviceId = getDeviceIdentifier();
            await axiosInstance.post('/devices', {
              deviceName: currentDeviceId,
              userAgent: navigator.userAgent
            });
            console.log('✅ Device registered:', currentDeviceId);
          } catch (deviceError) {
            // Device might already exist, ignore error
            if (deviceError.response?.status !== 400) {
              console.warn('Failed to register device:', deviceError);
            }
          }
          
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
      
      if (serverKeys.encryptedPrivateKey && serverKeys.privateKeyIV && serverKeys.masterKeyWrappedByPin && serverKeys.pinWrapIV) {
        console.log('🔓 Decrypting with envelope encryption...');
        
        // Use envelope decryption: unwrap master key with PIN, then decrypt private key
        const privateKeyPem = await decryptPrivateKeyWithPin(
          serverKeys.encryptedPrivateKey,
          serverKeys.privateKeyIV,
          serverKeys.masterKeyWrappedByPin,
          serverKeys.pinWrapIV,
          pin
        );
        
        // Import the decrypted private key
        const { importPrivateKey } = await import('../utils/encryption');
        const restoredPrivateKey = await importPrivateKey(privateKeyPem);
        const importedPublicKey = await importPublicKey(serverKeys.publicKey);
        
        // Store keys locally (creates PIN token for future use)
        await storeKeysSecurely(serverKeys.publicKey, restoredPrivateKey, pin);
        
        setPublicKey(importedPublicKey);
        setPrivateKey(restoredPrivateKey);
        setHasKeys(true);
        setEncryptionStatus('ready');
        setShowPinModal(false);
        setPinInput('');
        toast.success('🔐 Keys restored from server');
        console.log('✅ Token created in localStorage for future use');
        
        // Register device if not already registered
        try {
          const currentDeviceId = getDeviceIdentifier();
          await axiosInstance.post('/devices', {
            deviceName: currentDeviceId,
            userAgent: navigator.userAgent
          });
          console.log('✅ Device registered after server restore:', currentDeviceId);
        } catch (deviceError) {
          // Device might already exist, ignore error
          if (deviceError.response?.status !== 400) {
            console.warn('Failed to register device:', deviceError);
          }
        }
      } else {

        
        // Try to load local keys anyway (they'll work on this device)
        const localStoragePublicKey = localStorage.getItem('chat_public_key');
        if (localStoragePublicKey) {
          try {
            // Verify PIN with local token
            const localKeys = await retrieveStoredKeys(pin);
            if (localKeys.privateKey) {
              console.log('✅ Local keys verified and loaded (device-only mode)');
              
              // Import keys and use them locally
              const importedPublicKey = await importPublicKey(localStoragePublicKey);
              setPublicKey(importedPublicKey);
              setPrivateKey(localKeys.privateKey);
              setHasKeys(true);
              setEncryptionStatus('ready');
              setShowPinModal(false);
              setPinInput('');
              
              // Register device
              try {
                const currentDeviceId = getDeviceIdentifier();
                await axiosInstance.post('/devices', {
                  deviceName: currentDeviceId,
                  userAgent: navigator.userAgent
                });
                console.log('✅ Device registered:', currentDeviceId);
              } catch (deviceError) {
                if (deviceError.response?.status !== 400) {
                  console.warn('Failed to register device:', deviceError);
                }
              }
              
              toast.warning('Keys loaded locally only. Server has no backup. Use recovery code if needed on other devices.');
              return;
            }
          } catch (localError) {
            console.error('❌ Failed to verify local keys:', localError);
          }
        }
        
        throw new Error('No keys found on server or locally');
      }
    } catch (serverError) {
      console.error('❌ Failed to retrieve from server:', serverError);
      setPinError('Incorrect PIN or no encryption keys found');
      setEncryptionStatus('error');
    }
  };

  // ============================================================================
  // RECOVERY CODES - MANAGEMENT
  // ============================================================================
  const downloadRecoveryCodes = () => {
    const content = `MODA CHAT RECOVERY CODES\n\n` +
      `IMPORTANT: Keep these codes safe!\n` +
      `If you forget your PIN, you can use ONE of these codes to recover access.\n` +
      `Each code can only be used once.\n\n` +
      recoveryCodes.map((code, i) => `${i + 1}. ${code}`).join('\n') +
      `\n\nGenerated: ${new Date().toLocaleString()}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moda-recovery-codes-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Recovery codes downloaded');
  };
  
  const copyRecoveryCodes = () => {
    const text = recoveryCodes.join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Recovery codes copied to clipboard');
  };
  
  const printRecoveryCodes = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>MODA Recovery Codes</title>
          <style>
            body { font-family: monospace; padding: 40px; }
            h1 { font-size: 24px; margin-bottom: 20px; }
            .warning { color: red; margin-bottom: 20px; }
            .code { font-size: 18px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <h1>MODA CHAT RECOVERY CODES</h1>
          <p class="warning">⚠️ IMPORTANT: Keep these codes safe!</p>
          <p>If you forget your PIN, you can use ONE of these codes to recover access.</p>
          <p>Each code can only be used once.</p>
          <br/>
          ${recoveryCodes.map((code, i) => `<div class="code">${i + 1}. ${code}</div>`).join('')}
          <br/>
          <p>Generated: ${new Date().toLocaleString()}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  
  const handleRecoveryCodesConfirmed = () => {
    if (!hasConfirmedBackup) {
      toast.error('Please confirm you have saved your recovery codes');
      return;
    }
    setShowRecoveryCodesModal(false);
    setHasConfirmedBackup(false);
    toast.success('🔐 Secure messaging enabled');
  };
  
  const handleForgotPin = () => {
    setShowPinModal(false);
    setShowForgotPinModal(true);
    setPinInput('');
    setPinError('');
  };
  
  const handleRecoveryCodeSubmit = async () => {
    setRecoveryError('');
    
    if (!recoveryCodeInput.trim()) {
      setRecoveryError('Please enter a recovery code');
      return;
    }
    
    try {
      // Recover with code using envelope decryption
      const privateKeyPem = await recoverWithCode(recoveryCodeInput.trim(), axiosInstance);
      
      // Import the recovered private key
      const recoveredPrivateKey = await importPrivateKey(privateKeyPem);
      
      // Get public key from localStorage or server
      let publicKeyPem = localStorage.getItem('chat_public_key');
      if (!publicKeyPem) {
        const response = await axiosInstance.get('/chat/encrypted-keys');
        publicKeyPem = response.data.publicKey;
      }
      
      const importedPublicKey = await importPublicKey(publicKeyPem);
      
      // Restore keys immediately
      setPublicKey(importedPublicKey);
      setPrivateKey(recoveredPrivateKey);
      setHasKeys(true);
      setEncryptionStatus('ready');
      
      // Close recovery modal and ask for new PIN
      setShowForgotPinModal(false);
      setRecoveryCodeInput('');
      setShowPinModal(true);
      setIsSettingPin(true);
      setPinInput('');
      setConfirmPin('');
      
      toast.success('Recovery successful! Please set a new PIN');
    } catch (error) {
      console.error('Recovery failed:', error);
      setRecoveryError('Invalid recovery code or decryption failed');
    }
  };
  
  // ============================================================================
  // ENCRYPTION - PUBLIC KEY MANAGEMENT
  // ============================================================================
  const fetchFriendPublicKey = async (conversation) => {
    try {
      const friendId = conversation.otherUser?.id;
      
      if (!friendId) {
        console.log('❌ No friend ID found in conversation');
        return;
      }
      
      // Always fetch if not in cache
      if (friendPublicKeys[friendId]) {
        console.log('✅ Friend public key already cached for:', friendId);
        return;
      }
      
      console.log('🔑 Fetching public key for friend:', friendId);
      const response = await axiosInstance.get(`/chat/public-key/${friendId}`);
      const friendPublicKeyPem = response.data.publicKey;
      
      if (!friendPublicKeyPem) {
        console.log('❌ No public key returned for friend:', friendId);
        return;
      }
      
      console.log('📥 Received public key, importing...');
      const friendPublicKey = await importPublicKey(friendPublicKeyPem);
      setFriendPublicKeys(prev => ({ ...prev, [friendId]: friendPublicKey }));
      console.log('✅ Friend public key imported and cached for:', friendId);
    } catch (error) {
      console.error('❌ Failed to fetch friend public key:', error);
    }
  };

  // ============================================================================
  // EFFECTS - SOCKET CONNECTION
  // ============================================================================
  useEffect(() => {
    if (!user?.id) return;

    socketRef.current = io(SOCKET_URL, {
      query: { userId: user.id },
      transports: ["websocket"],
    });

    socketRef.current.on('new-message', async ({ conversationId, message }) => {
      // Decrypt incoming message if needed
      const decryptedMessage = await decryptIncomingMessage(message);
      
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

  // ============================================================================
  // ENCRYPTION - MESSAGE DECRYPTION
  // ============================================================================
  const decryptIncomingMessage = async (message) => {
    // If not encrypted or no encryption key, return as-is
    if (!message.isEncrypted || !privateKey) {
      return message;
    }

    // If message already has decrypted content, don't decrypt again
    if (message.content && message.content.trim() !== '') {
      return message;
    }

    try {
      const isSender = message.senderId === user.id;
      let decryptedContent;
      
      if (isSender && message.aesKey) {
        // Sender: decrypt with plain AES key
        decryptedContent = await decryptMessageWithAESKey(
          message.encryptedContent,
          message.iv,
          message.aesKey
        );
      } else if (message.encryptedAESKey) {
        // Receiver: decrypt AES key with private key, then decrypt message
        decryptedContent = await decryptMessageAES(
          message.encryptedContent,
          message.iv,
          message.encryptedAESKey,
          privateKey
        );
      } else {
        console.warn('Missing encryption data for message:', message.id);
        return { ...message, content: '[Encrypted]', isEncrypted: true };
      }
      
      // Ensure content is not empty
      if (!decryptedContent || decryptedContent.trim() === '') {
        console.error('Decryption returned empty content for message:', message.id);
        return { ...message, content: '[Decryption error]', isEncrypted: true };
      }
      
      return { ...message, content: decryptedContent, isEncrypted: true };
    } catch (error) {
      console.error('Message decryption failed:', error);
      return { ...message, content: '[Unable to decrypt]', isEncrypted: true };
    }
  };

  // ============================================================================
  // CHAT - CONVERSATION MANAGEMENT
  // ============================================================================
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
      const conversation = response.data.conversation;
      
      // Determine which user is the "other" user
      const otherUser = conversation.user1Id === user.id ? conversation.user2 : conversation.user1;
      
      // Transform conversation to include otherUser field for UI consistency
      const transformedConversation = {
        ...conversation,
        otherUser,
        lastMessage: conversation.messages?.[0] || null
      };
      
      setSelectedConversation(transformedConversation);
      
      // Set initial messages from the conversation response
      if (conversation.messages && conversation.messages.length > 0) {
        // Decrypt messages if needed
        if (privateKey) {
          const decryptedMessages = await Promise.all(
            conversation.messages.map(msg => decryptIncomingMessage(msg))
          );
          setMessages(decryptedMessages);
        } else {
          setMessages(conversation.messages);
        }
      } else {
        setMessages([]);
      }
      
      // Add to conversation list if not exists
      setConversations(prev => {
        const exists = prev.some(c => c.id === conversation.id);
        if (!exists) {
          return [transformedConversation, ...prev];
        }
        return prev.map(c => c.id === conversation.id ? transformedConversation : c);
      });
    } catch (error) {
      console.error('Failed to open conversation:', error);
      toast.error('Failed to open conversation');
    }
  };

  // ============================================================================
  // CHAT - MESSAGE MANAGEMENT
  // ============================================================================
  const fetchMessages = async (conversationId, before = null) => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (before) params.before = before;
      const response = await axiosInstance.get(`/chat/messages/${conversationId}`, { params });
      
      // Response format: { messages: [...] }
      const fetchedMessages = response.data.messages || [];
      
      // 🔐 Decrypt messages if they are encrypted
      if (privateKey && fetchedMessages.length > 0) {
        const decryptedMessages = await Promise.all(
          fetchedMessages.map(msg => decryptIncomingMessage(msg))
        );
        
        if (before) {
          // Prepend older messages for pagination
          setMessages(prev => [...decryptedMessages, ...prev]);
        } else {
          // Initial load
          setMessages(decryptedMessages);
        }
      } else {
        if (before) {
          setMessages(prev => [...fetchedMessages, ...prev]);
        } else {
          setMessages(fetchedMessages);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    setSending(true);
    const originalContent = messageInput; // Store original message
    
    // Clear input immediately to prevent double-send
    setMessageInput('');
    
    try {
      const friendId = selectedConversation.otherUser?.id;
      const friendPublicKey = friendPublicKeys[friendId];
      
      console.log('📤 Sending message:', {
        friendId,
        hasFriendPublicKey: !!friendPublicKey,
        hasKeys,
        hasPrivateKey: !!privateKey
      });
      
      let messageData = {
        conversationId: selectedConversation.id,
        content: originalContent,
        messageType: 'TEXT'
      };
      
      let isEncrypted = false;

      // MUST encrypt if both users have encryption enabled
      if (friendPublicKey && hasKeys && privateKey) {
        try {
          console.log('🔐 Encrypting message before sending...');
          const encrypted = await encryptMessageAES(originalContent, privateKey, friendPublicKey);
          console.log('✅ Message encrypted successfully');
          
          messageData = {
            ...messageData,
            content: '', // Server expects empty content for encrypted messages
            encryptedContent: encrypted.encryptedContent,
            iv: encrypted.iv,
            encryptedAESKey: encrypted.encryptedAESKey,
            aesKey: encrypted.aesKey,
            isEncrypted: true
          };
          isEncrypted = true;
        } catch (error) {
          console.error('❌ Encryption failed:', error);
          toast.error('Failed to encrypt message. Message not sent.');
          setSending(false);
          setMessageInput(originalContent); // Restore input
          return; // Don't send if encryption fails
        }
      } else {
        console.log('⚠️ Sending unencrypted message (missing encryption keys)');
      }

      // Only send after successful encryption (or if encryption not required)
      console.log('📡 Sending encrypted message to server...');
      const response = await axiosInstance.post('/chat/message', messageData);
      let newMessage = response.data.data || response.data;
      
      console.log('✅ Message sent successfully, adding to UI');
      
      // For encrypted messages, restore the original content for sender's display
      if (isEncrypted) {
        newMessage = { 
          ...newMessage, 
          content: originalContent, // Sender sees plain text
          isEncrypted: true 
        };
      }
      
      // Add message to UI only after successful send and encryption
      setMessages(prev => {
        const exists = prev.some(m => m.id === newMessage.id);
        if (exists) return prev;
        return [...prev, newMessage];
      });
      
      emitTyping(false);
      
      // Update conversation list with message that has content
      updateConversationInList(selectedConversation.id, { 
        ...newMessage, 
        content: originalContent,
        isEncrypted 
      });
      
      console.log('✅ Message displayed in UI (encrypted and sent)');
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      toast.error('Failed to send message');
      setMessageInput(originalContent); // Restore input on failure
    } finally {
      setSending(false);
    }
  };

  // ============================================================================
  // CHAT - MESSAGE STATUS
  // ============================================================================
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

  // ============================================================================
  // CHAT - TYPING INDICATORS
  // ============================================================================
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

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="flex h-screen relative-container text-[#353535]">
      <SideNav onCartOpen={() => setCartOpen(true)} />

      {/* ====================================================================== */}
      {/* PIN MODAL */}
      {/* ====================================================================== */}
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
              
              {!isSettingPin && (
                <button
                  onClick={handleForgotPin}
                  className="text-sm text-[#434237] hover:underline text-center w-full"
                >
                  Forgot PIN?
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* RECOVERY CODES MODAL */}
      {/* ====================================================================== */}
      {showRecoveryCodesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoCheckmarkCircleOutline className="text-3xl text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Save Your Recovery Codes</h2>
              <p className="text-gray-600">
                These codes can restore access if you forget your PIN. Each code works only once.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-3">
                {recoveryCodes.map((code, index) => (
                  <div key={index} className="bg-white p-3 rounded border border-gray-200">
                    <span className="text-xs text-gray-500 mr-2">{index + 1}.</span>
                    <span className="font-mono text-sm font-semibold">{code}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={downloadRecoveryCodes}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#434237] text-white rounded-lg hover:bg-[#5a594f] transition"
              >
                <IoDownloadOutline className="text-xl" />
                Download
              </button>
              <button
                onClick={copyRecoveryCodes}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-[#434237] text-[#434237] rounded-lg hover:bg-gray-50 transition"
              >
                <IoCopyOutline className="text-xl" />
                Copy
              </button>
              <button
                onClick={printRecoveryCodes}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-[#434237] text-[#434237] rounded-lg hover:bg-gray-50 transition"
              >
                <IoPrintOutline className="text-xl" />
                Print
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <IoWarningOutline className="text-yellow-600 text-xl flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Important Security Information</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Store these codes in a safe place (password manager, safe, etc.)</li>
                    <li>Never share these codes with anyone</li>
                    <li>Each code can only be used once</li>
                    <li>Without these codes, you cannot recover a forgotten PIN</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="backup-confirm"
                checked={hasConfirmedBackup}
                onChange={(e) => setHasConfirmedBackup(e.target.checked)}
                className="w-5 h-5 text-[#434237] rounded focus:ring-[#434237]"
              />
              <label htmlFor="backup-confirm" className="text-sm text-gray-700">
                I have saved my recovery codes in a secure location
              </label>
            </div>

            <button
              onClick={handleRecoveryCodesConfirmed}
              disabled={!hasConfirmedBackup}
              className="w-full bg-[#434237] text-white py-3 rounded-lg font-medium hover:bg-[#5a594f] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Continue to Chat
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* FORGOT PIN MODAL */}
      {/* ====================================================================== */}
      {showForgotPinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                  <IoWarningOutline className="text-3xl text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Forgot PIN?</h2>
                <p className="text-gray-600">
                  Enter one of your recovery codes to regain access
                </p>
              </div>
              <button
                onClick={() => {
                  setShowForgotPinModal(false);
                  setShowPinModal(true);
                  setRecoveryCodeInput('');
                  setRecoveryError('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <IoCloseOutline className="text-2xl" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Recovery Code
                </label>
                <input
                  type="text"
                  value={recoveryCodeInput}
                  onChange={(e) => setRecoveryCodeInput(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleRecoveryCodeSubmit()}
                  placeholder="XXXX-XXXX-XXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#434237] font-mono"
                  autoFocus
                />
              </div>

              {recoveryError && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <IoWarningOutline />
                  <span>{recoveryError}</span>
                </div>
              )}

              <button
                onClick={handleRecoveryCodeSubmit}
                disabled={!recoveryCodeInput}
                className="w-full bg-[#434237] text-white py-3 rounded-lg font-medium hover:bg-[#5a594f] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Verify Recovery Code
              </button>

              <div className="text-xs text-gray-500 text-center space-y-2">
                <p>⚠️ Each recovery code can only be used once</p>
                <p>After verification, you'll be able to set a new PIN</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* CONVERSATIONS SIDEBAR */}
      {/* ====================================================================== */}
      <div className="flex-1 ml-20 flex ">
        <div className="w-96 border-r-[0.1px] border-[#BFAF92] flex flex-col ">
          {/* Sidebar Header */}
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

          {/* User Note Section */}
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

          {/* Tab Navigation */}
          <div className="flex px-4 py-2 items-center ">
            <div className="flex-1 text-lg font-semibold ">
              Messages
            </div>
            <div className=" justify-end text-sm text-gray-400 ">
              Requests
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map((conv) => {
                // Determine the other user (not current user)
                const friend = conv.otherUser || (conv.user1Id === user.id ? conv.user2 : conv.user1);
                const isSelected = selectedConversation?.id === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversation(conv);
                      // Fetch friend's public key for encryption
                      if (hasKeys && conv.otherUser?.id) {
                        fetchFriendPublicKey(conv);
                      }
                    }}
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
                            {conv.lastMessage.productId 
                              ? '📦 Shared a product' 
                              : conv.lastMessage.isEncrypted && !conv.lastMessage.content
                                ? '🔐 Encrypted message'
                                : conv.lastMessage.senderId === user.id
                                  ? `You: ${conv.lastMessage.content || '🔐 Encrypted message'}`
                                  : conv.lastMessage.content || '🔐 Encrypted message'}
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

        {/* ================================================================== */}
        {/* CHAT AREA */}
        {/* ================================================================== */}
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
                            <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs font-semibold mr-2 flex-shrink-0 overflow-hidden">
                              <img 
                                src={msg.sender?.avatar?.url || selectedConversation.otherUser?.avatar?.url || ""} 
                                alt={msg.sender?.name || selectedConversation.otherUser?.name || "User"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          <div className={`max-w-xs`}>
                            {!msg.productId && (
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
                            
                            {msg.productId && msg.product && (
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
                            <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs font-semibold ml-2 flex-shrink-0 overflow-hidden">
                              <img 
                                src={user?.avatar?.url || ""} 
                                alt={user?.name || "You"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs font-semibold mr-2 flex-shrink-0 overflow-hidden">
                          <img 
                            src={selectedConversation.otherUser?.avatar?.url || ""} 
                            alt={selectedConversation.otherUser?.name || "User"}
                            className="w-full h-full object-cover"
                          />
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

      {/* ====================================================================== */}
      {/* CART MODAL */}
      {/* ====================================================================== */}
      <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default ChatPage;
