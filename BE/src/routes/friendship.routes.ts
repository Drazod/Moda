import { Router } from 'express';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getPendingRequests,
  getFriends,
  removeFriend,
  searchUsers
} from '../controllers/friendship.controller';
import authMiddleware from '../middlewares/authentication';

const friendshipRoute: Router = Router();

// All routes require authentication
friendshipRoute.use(authMiddleware);

/**
 * @swagger
 * /friendship/search:
 *   get:
 *     summary: Search users to add as friends
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Name or email to search for
 *         example: john
 *     responses:
 *       200:
 *         description: List of users with friendship status
 */
friendshipRoute.get('/search', searchUsers);

/**
 * @swagger
 * /friendship/request:
 *   post:
 *     summary: Send a friend request
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addresseeId
 *             properties:
 *               addresseeId:
 *                 type: integer
 *                 example: 5
 *           example:
 *             addresseeId: 5
 *     responses:
 *       201:
 *         description: Friend request sent
 */
friendshipRoute.post('/request', sendFriendRequest);

/**
 * @swagger
 * /friendship/requests:
 *   get:
 *     summary: Get pending friend requests
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending friend requests
 */
friendshipRoute.get('/requests', getPendingRequests);

/**
 * @swagger
 * /friendship/accept/{id}:
 *   put:
 *     summary: Accept a friend request
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Friendship ID from pending requests
 *         example: 10
 *     responses:
 *       200:
 *         description: Friend request accepted
 */
friendshipRoute.put('/accept/:id', acceptFriendRequest);

/**
 * @swagger
 * /friendship/reject/{id}:
 *   delete:
 *     summary: Reject a friend request
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Friendship ID to reject
 *         example: 10
 *     responses:
 *       200:
 *         description: Friend request rejected
 */
friendshipRoute.delete('/reject/:id', rejectFriendRequest);

/**
 * @swagger
 * /friendship/friends:
 *   get:
 *     summary: Get list of friends
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of friends
 */
friendshipRoute.get('/friends', getFriends);

/**
 * @swagger
 * /friendship/remove/{friendshipId}:
 *   delete:
 *     summary: Remove a friend
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendshipId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Friendship ID to remove
 *         example: 15
 *     responses:
 *       200:
 *         description: Friend removed
 */
friendshipRoute.delete('/remove/:friendshipId', removeFriend);

export default friendshipRoute;
