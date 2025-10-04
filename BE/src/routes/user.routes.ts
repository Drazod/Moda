import { Router } from 'express';
import authMiddleware from '../middlewares/authentication';
import { userProfile, userUpdate, userTransactionHistory } from '../controllers/user.controller';
import multer from 'multer';

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
});
// import { createPayment } from '../controllers/payment.controller';

const userRoute: Router = Router();

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
userRoute.get('/profile', authMiddleware, userProfile);

/**
 * @swagger
 * /user/update:
 *   post:
 *     summary: Update user profile with optional avatar upload
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *               address:
 *                 type: string
 *                 description: User's address
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
userRoute.post('/update', authMiddleware, upload.fields([{ name: 'avatar', maxCount: 1 }]), userUpdate);

// userRoute.post('/payment', createPayment);

/**
 * @swagger
 * /user/transactions:
 *   get:
 *     summary: Get user transaction history
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User transaction history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TransactionHistory'
 *       500:
 *         description: Internal server error
 */
userRoute.get('/transactions', authMiddleware, userTransactionHistory);

export default userRoute;