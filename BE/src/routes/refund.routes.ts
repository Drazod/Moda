import { Router } from 'express';
import { 
  requestRefund, 
  getRefundHistory, 
  getAllRefundRequests, 
  processRefundRequest 
} from '../controllers/refund.controller';
import authMiddleware from '../middlewares/authentication';

const router = Router();

/**
 * @swagger
 * /refund/request:
 *   post:
 *     summary: Request refund for a transaction item
 *     tags: [Refunds]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionDetailId:
 *                 type: integer
 *                 description: ID of the transaction detail item to refund
 *                 example: 123
 *               quantity:
 *                 type: integer
 *                 description: Quantity to refund
 *                 example: 2
 *               reason:
 *                 type: string
 *                 description: Reason for refund
 *                 example: "Item damaged on arrival"
 *             required:
 *               - transactionDetailId
 *               - quantity
 *     responses:
 *       201:
 *         description: Refund request submitted successfully
 *       400:
 *         description: Invalid request or insufficient quantity
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Transaction detail not found
 *       500:
 *         description: Internal server error
 */
router.post('/request', authMiddleware, requestRefund);

/**
 * @swagger
 * /refund/history:
 *   get:
 *     summary: Get user's refund history
 *     tags: [Refunds]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Refund history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 refunds:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       item:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       refundAmount:
 *                         type: number
 *                       pointsReturned:
 *                         type: integer
 *                       status:
 *                         type: string
 *                         enum: [PENDING, APPROVED, REJECTED, COMPLETED]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/history', authMiddleware, getRefundHistory);

/**
 * @swagger
 * /refund/admin/all:
 *   get:
 *     summary: Get all refund requests (Admin only)
 *     tags: [Refunds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, COMPLETED]
 *         description: Filter by refund status
 *     responses:
 *       200:
 *         description: All refund requests retrieved successfully
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
router.get('/admin/all', authMiddleware, getAllRefundRequests);

/**
 * @swagger
 * /refund/admin/process/{refundId}:
 *   put:
 *     summary: Process refund request (Admin only)
 *     tags: [Refunds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: refundId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the refund to process
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *                 description: Action to take on the refund
 *               adminNote:
 *                 type: string
 *                 description: Optional admin note
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Refund processed successfully
 *       400:
 *         description: Invalid status or already processed
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Refund not found
 *       500:
 *         description: Internal server error
 */
router.put('/admin/process/:refundId', authMiddleware, processRefundRequest);

export default router;