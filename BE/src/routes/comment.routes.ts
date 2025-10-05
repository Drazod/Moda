import { Router } from 'express';
import authMiddleware from '../middlewares/authentication';
import { 
  submitComment, 
  getUserComments, 
  getProductComments,
  updateComment,
  deleteComment,
  getCommentableItems
} from '../controllers/comment.controller';

const commentRoute: Router = Router();

/**
 * @swagger
 * /comments/submit:
 *   post:
 *     summary: Submit a comment/review for a purchased item
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionDetailId
 *               - content
 *               - rating
 *             properties:
 *               transactionDetailId:
 *                 type: integer
 *                 description: ID of the transaction detail item
 *                 example: 1
 *               content:
 *                 type: string
 *                 description: Review content
 *                 example: "Great product, excellent quality!"
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 to 5 stars
 *                 example: 5
 *     responses:
 *       201:
 *         description: Comment submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request or validation error
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Transaction detail not found
 */
commentRoute.post('/submit', authMiddleware, submitComment);

/**
 * @swagger
 * /comments/my-comments:
 *   get:
 *     summary: Get user's own comments/reviews
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 */
commentRoute.get('/my-comments', authMiddleware, getUserComments);

/**
 * @swagger
 * /comments/commentable-items:
 *   get:
 *     summary: Get items that user can comment on (purchased but not yet reviewed)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Commentable items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       transactionDetailId:
 *                         type: integer
 *                       clothesName:
 *                         type: string
 *                       size:
 *                         type: string
 *                       purchaseDate:
 *                         type: string
 *                         format: date-time
 */
commentRoute.get('/commentable-items', authMiddleware, getCommentableItems);

/**
 * @swagger
 * /comments/product/{productId}:
 *   get:
 *     summary: Get all comments for a specific product
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product (clothes) ID
 *     responses:
 *       200:
 *         description: Product comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalComments:
 *                       type: integer
 *                     averageRating:
 *                       type: number
 *                     ratingDistribution:
 *                       type: object
 */
commentRoute.get('/product/:productId', getProductComments);

/**
 * @swagger
 * /comments/{commentId}:
 *   put:
 *     summary: Update user's own comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Updated review content
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Updated rating
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized to update this comment
 *       404:
 *         description: Comment not found
 */
commentRoute.put('/:commentId', authMiddleware, updateComment);

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Delete user's own comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized to delete this comment
 *       404:
 *         description: Comment not found
 */
commentRoute.delete('/:commentId', authMiddleware, deleteComment);

export default commentRoute;