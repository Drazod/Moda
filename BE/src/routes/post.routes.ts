import { Router } from 'express';
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  getPost,
  deletePost,
  likePost,
  unlikePost,
  getPostLikes,
  addComment,
  getPostComments,
  deleteComment
} from '../controllers/post.controller';
import authMiddleware from '../middlewares/authentication';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
});

const postRoute: Router = Router();

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               caption:
 *                 type: string
 *                 description: Post caption/description
 *                 example: "Beautiful sunset at the beach! 🌅"
 *               location:
 *                 type: string
 *                 description: Location where the photo was taken
 *                 example: "Venice Beach, CA"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Post images (max 10)
 *           example:
 *             caption: "Beautiful sunset at the beach! "
 *             location: "Venice Beach, CA"
 *     responses:
 *       201:
 *         description: Post created successfully
 */
postRoute.post('/', authMiddleware, upload.fields([{ name: 'images', maxCount: 10 }]), createPost);

/**
 * @swagger
 * /posts/feed:
 *   get:
 *     summary: Get feed posts from friends and own posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of posts with pagination
 */
postRoute.get('/feed', authMiddleware, getFeedPosts);

/**
 * @swagger
 * /posts/user/{userId}:
 *   get:
 *     summary: Get posts by specific user
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of user's posts with pagination
 */
postRoute.get('/user/:userId', getUserPosts);

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Get single post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post details with comments
 *       404:
 *         description: Post not found
 */
postRoute.get('/:postId', getPost);

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Delete a post (own post or admin)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       403:
 *         description: Not authorized to delete this post
 *       404:
 *         description: Post not found
 */
postRoute.delete('/:postId', authMiddleware, deletePost);

/**
 * @swagger
 * /posts/{postId}/like:
 *   post:
 *     summary: Like a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post liked successfully
 *       400:
 *         description: Post already liked
 *       404:
 *         description: Post not found
 */
postRoute.post('/:postId/like', authMiddleware, likePost);

/**
 * @swagger
 * /posts/{postId}/like:
 *   delete:
 *     summary: Unlike a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post unliked successfully
 *       400:
 *         description: Post not liked yet
 */
postRoute.delete('/:postId/like', authMiddleware, unlikePost);

/**
 * @swagger
 * /posts/{postId}/likes:
 *   get:
 *     summary: Get users who liked a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of users who liked the post
 */
postRoute.get('/:postId/likes', getPostLikes);

/**
 * @swagger
 * /posts/{postId}/comments:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Comment text
 *                 example: "Great photo! 😍"
 *           example:
 *             content: "Great photo! 😍"
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Invalid comment content
 *       404:
 *         description: Post not found
 */
postRoute.post('/:postId/comments', authMiddleware, addComment);

/**
 * @swagger
 * /posts/{postId}/comments:
 *   get:
 *     summary: Get comments for a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of comments with pagination
 */
postRoute.get('/:postId/comments', getPostComments);

/**
 * @swagger
 * /posts/{postId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment (own comment, post owner, or admin)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Post ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: Not authorized to delete this comment
 *       404:
 *         description: Comment not found
 */
postRoute.delete('/:postId/comments/:commentId', authMiddleware, deleteComment);

export default postRoute;
