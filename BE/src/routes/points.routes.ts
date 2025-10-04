import { Router } from 'express';
import { getPointsInfo } from '../controllers/points.controller';
import authMiddleware from '../middlewares/authentication';

const router = Router();

/**
 * @swagger
 * /points/info:
 *   get:
 *     summary: Get user's points balance and history
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Points information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPoints:
 *                   type: integer
 *                   example: 1500
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       points:
 *                         type: integer
 *                       type:
 *                         type: string
 *                         enum: [EARNED_PAYMENT, RETURNED_REFUND]
 *                       description:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/info', authMiddleware, getPointsInfo);

export default router;