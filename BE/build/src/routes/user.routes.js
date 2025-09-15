"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const user_controller_1 = require("../controllers/user.controller");
// import { createPayment } from '../controllers/payment.controller';
const userRoute = (0, express_1.Router)();
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
userRoute.get('/profile', authentication_1.default, user_controller_1.userProfile);
userRoute.post('/update', authentication_1.default, user_controller_1.userUpdate);
// userRoute.post('/payment', createPayment);
exports.default = userRoute;
