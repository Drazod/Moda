import { Request, Response } from 'express';
import { prisma } from '..';
import { io } from '../index';

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
    
    res.status(200).json({ conversation });
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
        
        return {
          id: conv.id,
          otherUser,
          lastMessage: conv.messages[0] || null,
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
  const { conversationId, content, messageType = 'TEXT', productId, imageUrl } = req.body;
  
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  if (!conversationId) return res.status(400).json({ message: "conversationId is required" });
  
  // Validate message content based on type
  if (messageType === 'TEXT' && !content) {
    return res.status(400).json({ message: "content is required for text messages" });
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
        content: content || null,
        messageType,
        productId: productId || null,
        imageUrl: imageUrl || null
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
    
    // Emit to receiver
    io.to(String(receiverId)).emit('new-message', {
      conversationId,
      message
    });
    
    // Emit to sender (for their other devices/tabs)
    io.to(String(req.user.id)).emit('new-message', {
      conversationId,
      message
    });
    
    res.status(201).json({ message: "Message sent", data: message });
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
    
    res.status(200).json({ messages: messages.reverse() });
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
    
    // Create message with product
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: req.user.id,
        content: customMessage || `Check out this product: ${product.name}`,
        messageType: 'PRODUCT',
        productId
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
    
    // Emit to receiver
    io.to(String(receiverId)).emit('new-message', {
      conversationId,
      message
    });
    
    // Emit to sender (for their other devices/tabs)
    io.to(String(req.user.id)).emit('new-message', {
      conversationId,
      message
    });
    
    res.status(201).json({ message: "Product shared", data: message });
  } catch (error) {
    console.error("Error sharing product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
