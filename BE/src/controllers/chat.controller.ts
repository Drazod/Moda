import { Request, Response } from 'express';
import { prisma } from '..';
import { io } from '../index';
import { stringToBinary, binaryToString } from '../utils/binary';
import { setCache, getCache, delCachePattern, delCache } from '../config/redis';

/**
 * Get or create conversation with a friend
 * POST /chat/conversation
 */
export const getOrCreateConversation = async (req: Request, res: Response) => {
  const { friendId } = req.body;
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  if (!friendId) return res.status(400).json({ message: "friendId is required" });
  
  const userId = req.user.id;
  
  try {
    // Verify they are friends
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: friendId, status: 'ACCEPTED' },
          { requesterId: friendId, addresseeId: userId, status: 'ACCEPTED' }
        ]
      }
    });
    
    if (!friendship) {
      return res.status(403).json({ message: "You must be friends to start a conversation" });
    }
    
    // Order user IDs consistently (smaller first)
    const [user1Id, user2Id] = userId < friendId ? [userId, friendId] : [friendId, userId];
    
    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: { user1Id, user2Id },
      include: {
        user1: {
          select: { 
            id: true, 
            name: true, 
            email: true, 
            avatar: { 
              select: { id: true, name: true, url: true } 
            } 
          }
        },
        user2: {
          select: { 
            id: true, 
            name: true, 
            email: true, 
            avatar: { 
              select: { id: true, name: true, url: true } 
            } 
          }
        },
        messages: {
          take: 50,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: { 
                id: true, 
                name: true, 
                avatar: { 
                  select: { id: true, name: true, url: true } 
                } 
              }
            },
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                mainImg: {
                  select: { id: true, name: true, url: true }
                }
              }
            }
          }
        }
      }
    });
    
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { user1Id, user2Id },
        include: {
          user1: {
            select: { 
              id: true, 
              name: true, 
              email: true, 
              avatar: { 
                select: { id: true, name: true, url: true } 
              } 
            }
          },
          user2: {
            select: { 
              id: true, 
              name: true, 
              email: true, 
              avatar: { 
                select: { id: true, name: true, url: true } 
              } 
            }
          },
          messages: {
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: {
              sender: {
                select: { 
                  id: true, 
                  name: true, 
                  avatar: { 
                    select: { id: true, name: true, url: true } 
                  } 
                }
              },
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  mainImg: {
                    select: { id: true, name: true, url: true }
                  }
                }
              }
            }
          }
        }
      });
    }
    
    // Decode binary content in messages (keep encrypted as-is)
    const decodedConversation = {
      ...conversation,
      messages: conversation.messages.map(msg => ({
        ...msg,
        content: msg.content ? (msg.isEncrypted ? msg.content : binaryToString(msg.content)) : null,
        isEncrypted: msg.isEncrypted
      }))
    };
    
    res.status(200).json({ conversation: decodedConversation });
  } catch (error) {
    console.error("Error getting/creating conversation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get all conversations for current user
 * GET /chat/conversations
 */
export const getConversations = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { user1Id: req.user.id },
          { user2Id: req.user.id }
        ]
      },
      include: {
        user1: {
          select: { 
            id: true, 
            name: true, 
            email: true, 
            avatar: { 
              select: { id: true, name: true, url: true } 
            } 
          }
        },
        user2: {
          select: { 
            id: true, 
            name: true, 
            email: true, 
            avatar: { 
              select: { id: true, name: true, url: true } 
            } 
          }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    
    // Add unread count and format response
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: req.user!.id },
            isRead: false
          }
        });
        
        const otherUser = conv.user1Id === req.user!.id ? conv.user2 : conv.user1;
        
        // Decode binary content in last message (keep encrypted as-is)
        const lastMessage = conv.messages[0] ? {
          ...conv.messages[0],
          content: conv.messages[0].content ? (conv.messages[0].isEncrypted ? conv.messages[0].content : binaryToString(conv.messages[0].content)) : null,
          isEncrypted: conv.messages[0].isEncrypted
        } : null;
        
        return {
          id: conv.id,
          otherUser,
          lastMessage,
          unreadCount,
          updatedAt: conv.updatedAt
        };
      })
    );
    
    res.status(200).json({ conversations: conversationsWithDetails });
  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Send a message
 * POST /chat/message
 */
export const sendMessage = async (req: Request, res: Response) => {
  const { 
    conversationId, 
    content, 
    encryptedContent,
    iv,
    encryptedAESKey,
    aesKey,
    messageType = 'TEXT', 
    productId, 
    imageUrl, 
    isEncrypted = false 
  } = req.body;
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  if (!conversationId) return res.status(400).json({ message: "conversationId is required" });
  
  // Validate message content based on type and encryption
  if (messageType === 'TEXT' && !content && !encryptedContent) {
    return res.status(400).json({ message: "content or encryptedContent is required for text messages" });
  }
  if (messageType === 'PRODUCT' && !productId) {
    return res.status(400).json({ message: "productId is required for product messages" });
  }
  if (messageType === 'IMAGE' && !imageUrl) {
    return res.status(400).json({ message: "imageUrl is required for image messages" });
  }
  
  try {
    // Verify user is part of conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });
    
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    
    if (conversation.user1Id !== req.user.id && conversation.user2Id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: req.user.id,
        // If encrypted, store encryption data; otherwise encode plain text to binary
        content: isEncrypted ? null : (content ? stringToBinary(content) : null),
        encryptedContent: isEncrypted ? encryptedContent : null,
        iv: isEncrypted ? iv : null,
        encryptedAESKey: isEncrypted ? encryptedAESKey : null,
        aesKey: isEncrypted ? aesKey : null,
        messageType,
        productId: productId || null,
        imageUrl: imageUrl || null,
        isEncrypted
      },
      include: {
        sender: {
          select: { id: true, name: true, avatar: true }
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
            mainImg: true
          }
        }
      }
    });
    
    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });
    
    // Emit socket event to both users in the conversation
    const receiverId = conversation.user1Id === req.user.id ? conversation.user2Id : conversation.user1Id;
    
    // Prepare message for transmission (keep encrypted content as-is, decode plain text)
    const messageData = {
      ...message,
      content: message.content ? (message.isEncrypted ? message.content : binaryToString(message.content)) : null,
      isEncrypted: message.isEncrypted
    };
    
    // Emit to receiver
    io.to(String(receiverId)).emit('new-message', {
      conversationId,
      message: messageData
    });
    
    // Emit to sender (for their other devices/tabs)
    io.to(String(req.user.id)).emit('new-message', {
      conversationId,
      message: messageData
    });
    
    res.status(201).json({ message: "Message sent", data: messageData });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get messages in a conversation
 * GET /chat/messages/:conversationId
 */
export const getMessages = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const { limit = 50, before } = req.query;
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  
  try {
    // Verify user is part of conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(conversationId) }
    });
    
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    
    if (conversation.user1Id !== req.user.id && conversation.user2Id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    // Get messages
    const messages = await prisma.message.findMany({
      where: {
        conversationId: parseInt(conversationId),
        ...(before && { createdAt: { lt: new Date(String(before)) } })
      },
      take: parseInt(String(limit)),
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: { 
            id: true, 
            name: true, 
            avatar: { 
              select: { id: true, name: true, url: true } 
            } 
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
            mainImg: {
              select: { id: true, name: true, url: true }
            }
          }
        }
      }
    });
    
    // Return messages with encryption fields intact for frontend decryption
    const processedMessages = messages.map(msg => ({
      ...msg,
      // Only decode binary content for plain text messages
      content: msg.isEncrypted ? null : (msg.content ? binaryToString(msg.content) : null),
      // Keep all encryption fields for E2E encrypted messages
      encryptedContent: msg.encryptedContent || undefined,
      iv: msg.iv || undefined,
      encryptedAESKey: msg.encryptedAESKey || undefined,
      aesKey: msg.aesKey || undefined,
      isEncrypted: msg.isEncrypted
    }));
    
    res.status(200).json({ messages: processedMessages.reverse() });
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Mark messages as read
 * PUT /chat/messages/read/:conversationId
 */
export const markMessagesAsRead = async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  
  try {
    // Verify user is part of conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(conversationId) }
    });
    
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    
    if (conversation.user1Id !== req.user.id && conversation.user2Id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    // Mark all messages from the other user as read
    await prisma.message.updateMany({
      where: {
        conversationId: parseInt(conversationId),
        senderId: { not: req.user.id },
        isRead: false
      },
      data: { isRead: true }
    });
    
    // Emit socket event to the other user (sender) so they know their messages were read
    const otherUserId = conversation.user1Id === req.user.id ? conversation.user2Id : conversation.user1Id;
    io.to(String(otherUserId)).emit('messages-read', {
      conversationId: parseInt(conversationId),
      readByUserId: req.user.id
    });
    
    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Share product with friend
 * POST /chat/share-product
 */
export const shareProduct = async (req: Request, res: Response) => {
  const { conversationId, productId, message: customMessage } = req.body;
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  if (!conversationId || !productId) {
    return res.status(400).json({ message: "conversationId and productId are required" });
  }
  
  try {
    // Verify product exists
    const product = await prisma.clothes.findUnique({
      where: { id: productId },
      select: { id: true, name: true }
    });
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Verify user is part of conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });
    
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    
    if (conversation.user1Id !== req.user.id && conversation.user2Id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    // Create message with product (encode to binary)
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: req.user.id,
        content: stringToBinary(customMessage || `Check out this product: ${product.name}`),
        messageType: 'PRODUCT',
        productId,
        isEncrypted: false // Product shares are never encrypted
      },
      include: {
        sender: {
          select: { 
            id: true, 
            name: true, 
            avatar: { 
              select: { id: true, name: true, url: true } 
            } 
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
            mainImg: {
              select: { id: true, name: true, url: true }
            }
          }
        }
      }
    });
    
    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });
    
    // Emit socket event to both users in the conversation
    const receiverId = conversation.user1Id === req.user.id ? conversation.user2Id : conversation.user1Id;
    
    // Decode binary content for transmission
    const messageData = {
      ...message,
      content: message.content ? binaryToString(message.content) : null,
      isEncrypted: false
    };
    
    // Emit to receiver
    io.to(String(receiverId)).emit('new-message', {
      conversationId,
      message: messageData
    });
    
    // Emit to sender (for their other devices/tabs)
    io.to(String(req.user.id)).emit('new-message', {
      conversationId,
      message: messageData
    });
    
    res.status(201).json({ message: "Product shared", data: messageData });
  } catch (error) {
    console.error("Error sharing product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get another user's public key for E2E encryption
 * POST /chat/public-key
 * Body: { otherUserId: number }
 */
export const getUserPublicKey = async (req: Request, res: Response) => {
  const otherUserId = parseInt(req.params.otherUserId, 10);
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  
  if (!otherUserId) {
    return res.status(400).json({ message: "otherUserId is required" });
  }
  
  try {
    // Verify they are friends first (security)
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: req.user.id, addresseeId: otherUserId, status: 'ACCEPTED' },
          { requesterId: otherUserId, addresseeId: req.user.id, status: 'ACCEPTED' }
        ]
      }
    });
    
    if (!friendship) {
      return res.status(403).json({ 
        message: "Can only get public keys of friends" 
      });
    }
    
    // Check cache first
    const cacheKey = `user:${otherUserId}:publicKey`;
    const cached = await getCache(cacheKey);
    
    if (cached) {
      return res.status(200).json(cached);
    }
    
    // Get from database
    const user = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: { 
        id: true, 
        name: true,
        publicKey: true,
        publicKeyDevice: true,
        publicKeyUpdatedAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (!user.publicKey) {
      return res.status(404).json({ 
        message: "User has not set up encryption keys yet",
        requiresSetup: true
      });
    }
    
    const response = {
      userId: user.id,
      name: user.name,
      publicKey: user.publicKey,
      device: user.publicKeyDevice || 'Unknown device',
      lastUpdated: user.publicKeyUpdatedAt
    };
    
    // Cache for 1 hour
    await setCache(cacheKey, response, 3600);
    
    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting public key:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Set/Update user's own public key and encrypted private key backup
 * POST /chat/setup-encryption
 * Body: { publicKey: string, encryptedPrivateKey: string, privateKeyIV: string, deviceId: string }
 */
export const setupEncryption = async (req: Request, res: Response) => {
  const { publicKey, encryptedPrivateKey, privateKeyIV, deviceId } = req.body;
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  
  if (!publicKey) {
    return res.status(400).json({ 
      message: "publicKey is required" 
    });
  }
  
  try {
    // Update user's encryption keys (including encrypted private key backup)
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        publicKey,
        encryptedPrivateKey: encryptedPrivateKey || null,
        privateKeyIV: privateKeyIV || null,
        publicKeyDevice: deviceId || 'Unknown device',
        publicKeyUpdatedAt: new Date()
      }
    });
    
    // Clear cache
    await delCache(`user:${req.user.id}:publicKey`);
    
    res.status(200).json({ 
      message: "Encryption keys updated successfully",
      device: deviceId || 'Unknown device',
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error setting up encryption:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get user's encrypted private key backup from server
 * GET /chat/encrypted-keys
 */
export const getEncryptedKeys = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        encryptedPrivateKey: true,
        privateKeyIV: true,
        publicKey: true,
        publicKeyDevice: true,
        publicKeyUpdatedAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (!user.encryptedPrivateKey || !user.privateKeyIV) {
      return res.status(404).json({ 
        message: "No encrypted keys found on server",
        requiresSetup: true
      });
    }
    
    res.status(200).json({
      encryptedPrivateKey: user.encryptedPrivateKey,
      privateKeyIV: user.privateKeyIV,
      publicKey: user.publicKey,
      device: user.publicKeyDevice,
      lastUpdated: user.publicKeyUpdatedAt
    });
  } catch (error) {
    console.error("Error getting encrypted keys:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

