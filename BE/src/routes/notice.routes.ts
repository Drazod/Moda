import { Router } from "express";
import { getNotices, createNotice, updateNoticeState } from "../controllers/notice.controller";
import authMiddleware from "../middlewares/authentication";
import authorize from "../middlewares/authorization";
import multer from 'multer';
export const upload = multer({
    storage: multer.memoryStorage(),
});

const noticeRoute: Router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Notice:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - pages
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         subtitle:
 *           type: string
 *         content:
 *           type: string
 *         image:
 *           type: string
 *         pages:
 *           type: array
 *           items:
 *             type: string
 *         state:
 *           type: boolean
 *           default: false
 */

/**
 * @swagger
 * /notice:
 *   get:
 *     summary: Get all notices
 *     tags: [Notice]
 *     responses:
 *       200:
 *         description: A list of notices
 */
noticeRoute.get("/", getNotices);

/**
 * @swagger
 * /notice:
 *   post:
 *     summary: Create a new notice with image upload
 *     tags: [Notice]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the notice
 *               subtitle:
 *                 type: string
 *               content:
 *                 type: string
 *               pages:
 *                 type: string
 *                 description: JSON string array, e.g., ["welcome page"]
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       201:
 *         description: Notice created successfully
 */
noticeRoute.post('/',
    upload.fields([
        { name: 'image'}
    ]), authMiddleware, authorize(["ADMIN"]),
    createNotice);

/**
 * @swagger
 * /notice/{id}/state:
 *   put:
 *     summary: Update state (active/disable) of a notice
 *     tags: [Notice]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the notice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notice state updated
 */
noticeRoute.put("/:id/state", authMiddleware, authorize(["ADMIN"]), updateNoticeState);

export default noticeRoute;
