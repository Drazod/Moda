import { Router } from 'express';
import { Login, Register, changePassword, someFunction, changeIdentity, rollbackPassword } from '../controllers/auth.controller';
import { verifyOtp } from '../controllers/auth.controller';

import authMiddleware from '../middlewares/authentication';

const userRoute: Router = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user.
 *         email:
 *           type: string
 *           description: The email of the user.
 *         password:
 *           type: string
 *           description: The hashed password of the user.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (e.g. missing fields, weak password, or user already exists)
 *       500:
 *         description: Internal server error
 */
userRoute.post('/register', Register);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP for email activation
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Internal server error
 */
userRoute.post('/verify-otp', verifyOtp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful. Returns user data and JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5..."
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
userRoute.post('/login', Login);

/**
 * @swagger
 * /auth/{id}/changePass:
 *   put:
 *     summary: Change user's password
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The user's old password.
 *               newPassword:
 *                 type: string
 *                 description: The new password (must be at least 6 characters).
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed"
 *       400:
 *         description: Old password is incorrect or user not found
 *       500:
 *         description: Internal server error
 */
userRoute.put('/changePass', authMiddleware, changePassword);

/**
 * @swagger
 * /auth/rollback-password:
 *   get:
 *     summary: Rollback password change using email token
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The rollback token from email
 *     responses:
 *       200:
 *         description: Password successfully rolled back
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password has been successfully restored"
 *       400:
 *         description: Invalid, expired, or used token
 *       500:
 *         description: Internal server error
 */
userRoute.get('/rollback-password', rollbackPassword);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the authenticated user's details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - user is not authenticated
 *       500:
 *         description: Internal server error
 */
userRoute.get('/me', [authMiddleware], someFunction);

/**
 * @swagger
 * /auth/{id}/changeName:
 *   put:
 *     summary: Change user's name
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newName:
 *                 type: string
 *                 description: The new name for the user.
 *                 example: "John Doe"
 *     responses:
 *       200:
 *         description: Name changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Name changed"
 *       400:
 *         description: Invalid name or user not found
 *       500:
 *         description: Internal server error
 */
userRoute.put('/:id/changeProfile', changeIdentity);

export default userRoute;
