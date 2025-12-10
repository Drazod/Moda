import { Router } from 'express';
import {
  getOrCreateConversation,
  getConversations,
  sendMessage,
  getMessages,
  markMessagesAsRead,
  shareProduct,
  getUserPublicKey,
  setupEncryption,
  getEncryptedKeys
} from '../controllers/chat.controller';
import authMiddleware from '../middlewares/authentication';
import { rateLimitMiddleware } from '../middlewares/rateLimit';

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
 *                 description: Message content (plain text for unencrypted messages)
 *                 example: Hey! How are you?
 *               encryptedContent:
 *                 type: string
 *                 description: AES encrypted message content (base64)
 *                 example: U2FsdGVkX1...
 *               iv:
 *                 type: string
 *                 description: Initialization Vector for AES encryption (base64)
 *                 example: 5fY3X8k2...
 *               encryptedAESKey:
 *                 type: string
 *                 description: AES key encrypted with recipient's RSA public key (base64)
 *                 example: abc123...
 *               aesKey:
 *                 type: string
 *                 description: Plain AES key (stored for sender to decrypt own messages)
 *                 example: xyz789...
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
 *               isEncrypted:
 *                 type: boolean
 *                 default: false
 *                 description: Set to true if using E2E encryption (AES hybrid)
 *                 example: false
 *           examples:
 *             textMessage:
 *               summary: Send plain text message
 *               value:
 *                 conversationId: 3
 *                 content: Hey! How are you?
 *                 messageType: TEXT
 *                 isEncrypted: false
 *             encryptedMessage:
 *               summary: Send E2E encrypted message (AES hybrid)
 *               value:
 *                 conversationId: 3
 *                 encryptedContent: U2FsdGVkX1+abc123...
 *                 iv: 5fY3X8k2...
 *                 encryptedAESKey: rsa_encrypted_aes_key_base64...
 *                 aesKey: plain_aes_key_for_sender...
 *                 messageType: TEXT
 *                 isEncrypted: true
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
 *       429:
 *         description: Rate limit exceeded (max 30 messages per minute)
 */
chatRoute.post('/message', rateLimitMiddleware('send-message', 30, 60), sendMessage);

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
chatRoute.post('/share-product', rateLimitMiddleware('share-product', 20, 60), shareProduct);

/**
 * @swagger
 * /chat/public-key:
 *   post:
 *     summary: Get another user's public encryption key (E2E)
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
 *               - otherUserId
 *             properties:
 *               otherUserId:
 *                 type: integer
 *                 description: The friend's user ID
 *     responses:
 *       200:
 *         description: Friend's public key with device and timestamp
 *       403:
 *         description: Not friends with this user
 */
chatRoute.get('/public-key/:otherUserId', getUserPublicKey);

/**
 * @swagger
 * /chat/setup-encryption:
 *   post:
 *     summary: Set up or update encryption keys with server backup
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
 *               - publicKey
 *             properties:
 *               publicKey:
 *                 type: string
 *                 description: RSA public key in PEM format
 *               encryptedPrivateKey:
 *                 type: string
 *                 description: Private key encrypted with user's PIN (for server backup)
 *               privateKeyIV:
 *                 type: string
 *                 description: IV used to encrypt the private key
 *               deviceId:
 *                 type: string
 *                 description: Device identifier (e.g., "Chrome on Windows", "iPhone 15")
 *     responses:
 *       200:
 *         description: Encryption setup successful
 */
chatRoute.post('/setup-encryption', setupEncryption);

/**
 * @swagger
 * /chat/encrypted-keys:
 *   get:
 *     summary: Retrieve encrypted private key backup from server
 *     description: Used to restore encryption keys on a new device using PIN
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Encrypted private key backup retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 encryptedPrivateKey:
 *                   type: string
 *                   description: Private key encrypted with user's PIN
 *                 privateKeyIV:
 *                   type: string
 *                   description: IV for decryption
 *                 publicKey:
 *                   type: string
 *                   description: User's public key
 *                 device:
 *                   type: string
 *                   description: Device that created these keys
 *                 lastUpdated:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: No encrypted keys found on server
 */
chatRoute.get('/encrypted-keys', getEncryptedKeys);

export default chatRoute;
