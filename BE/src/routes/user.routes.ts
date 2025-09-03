import { Router } from 'express';
import authMiddleware from '../middlewares/authentication';
import { userProfile, userUpdate } from '../controllers/user.controller';
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

userRoute.post('/update', authMiddleware, userUpdate);

// userRoute.post('/payment', createPayment);

export default userRoute;