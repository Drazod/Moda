import { Router } from 'express';
import {
  getOrCreateConversation,
  getConversations,
  sendMessage,
  getMessages,
  markMessagesAsRead,
  shareProduct
} from '../controllers/chat.controller';
import authMiddleware from '../middlewares/authentication';

const chatRoute: Router = Router();

// All routes require authentication
chatRoute.use(authMiddleware);

/**
 * @swagger
 * /chat/conversations:
 *   get:
 *     summary: Get all conversations for current user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations with last message and unread count
 */
chatRoute.get('/conversations', getConversations);

/**
 * @swagger
 * /chat/conversation:
 *   post:
 *     summary: Get or create conversation with a friend
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - friendId
 *             properties:
 *               friendId:
 *                 type: integer
 *                 description: User ID of the friend to chat with
 *                 example: 7
 *           example:
 *             friendId: 7
 *     responses:
 *       200:
 *         description: Conversation created or retrieved
 */
chatRoute.post('/conversation', getOrCreateConversation);

/**
 * @swagger
 * /chat/message:
 *   post:
 *     summary: Send a message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversationId
 *             properties:
 *               conversationId:
 *                 type: integer
 *                 example: 3
 *               content:
 *                 type: string
 *                 example: Hey! How are you?
 *               messageType:
 *                 type: string
 *                 enum: [TEXT, PRODUCT, IMAGE]
 *                 default: TEXT
 *                 example: TEXT
 *               productId:
 *                 type: integer
 *                 example: 12
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *           examples:
 *             textMessage:
 *               summary: Send text message
 *               value:
 *                 conversationId: 3
 *                 content: Hey! How are you?
 *                 messageType: TEXT
 *             productMessage:
 *               summary: Send product message
 *               value:
 *                 conversationId: 3
 *                 content: Check out this item!
 *                 messageType: PRODUCT
 *                 productId: 12
 *             imageMessage:
 *               summary: Send image message
 *               value:
 *                 conversationId: 3
 *                 messageType: IMAGE
 *                 imageUrl: https://example.com/image.jpg
 *     responses:
 *       201:
 *         description: Message sent
 */
chatRoute.post('/message', sendMessage);

/**
 * @swagger
 * /chat/messages/{conversationId}:
 *   get:
 *     summary: Get messages in a conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         example: 50
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Get messages before this timestamp (for pagination)
 *         example: 2025-11-14T10:30:00.000Z
 *     responses:
 *       200:
 *         description: List of messages
 */
chatRoute.get('/messages/:conversationId', getMessages);

/**
 * @swagger
 * /chat/messages/read/{conversationId}:
 *   put:
 *     summary: Mark messages as read
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of conversation to mark messages as read
 *         example: 3
 *     responses:
 *       200:
 *         description: Messages marked as read
 */
chatRoute.put('/messages/read/:conversationId', markMessagesAsRead);

/**
 * @swagger
 * /chat/share-product:
 *   post:
 *     summary: Share a product with a friend
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversationId
 *               - productId
 *             properties:
 *               conversationId:
 *                 type: integer
 *                 example: 3
 *               productId:
 *                 type: integer
 *                 example: 25
 *               message:
 *                 type: string
 *                 example: I think you'll love this dress!
 *           example:
 *             conversationId: 3
 *             productId: 25
 *             message: I think you'll love this dress!
 *     responses:
 *       201:
 *         description: Product shared successfully
 */
chatRoute.post('/share-product', shareProduct);

export default chatRoute;
