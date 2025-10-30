import { Router } from "express";
import { getLogs } from "../controllers/log.controller";
import authMiddleware from "../middlewares/authentication";
import authorize from "../middlewares/authorization";

const logRoute: Router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Log:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         userName:
 *           type: string
 *         action:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /log:
 *   get:
 *     summary: Get all logs
 *     tags: [Log]
 *     responses:
 *       200:
 *         description: List of logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Log'
 */
logRoute.get("/", authMiddleware, authorize(["ADMIN", "HOST"]), getLogs);

export default logRoute;
