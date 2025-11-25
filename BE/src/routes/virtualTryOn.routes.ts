import { Router } from 'express';
import { virtualTryOn} from '../controllers/virtualTryOn.controller';
import authMiddleware from '../middlewares/authentication';
import multer from 'multer';

const virtualTryOnRoute: Router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /virtual-tryon:
 *   post:
 *     summary: Virtual try-on using AI
 *     description: Upload images or provide URLs to generate virtual try-on result
 *     tags: [Virtual Try-On]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               humanImage:
 *                 type: string
 *                 format: binary
 *                 description: Image file of the person (.jpg, .png)
 *               clothImage:
 *                 type: string
 *                 format: binary
 *                 description: Image file of the clothing item (.jpg, .png)
 *           example:
 *             humanImage: <binary file>
 *             clothImage: <binary file>
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               humanImageUrl:
 *                 type: string
 *                 description: URL of the person image
 *                 example: https://example.com/person.jpg
 *               clothImageUrl:
 *                 type: string
 *                 description: URL of the clothing image
 *                 example: https://example.com/cloth.jpg
 *     responses:
 *       200:
 *         description: Virtual try-on completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 imageBase64:
 *                   type: string
 *                   description: Base64 encoded result image
 *                 inputImages:
 *                   type: object
 *                   properties:
 *                     human:
 *                       type: string
 *                     cloth:
 *                       type: string
 *       400:
 *         description: Missing required images
 *       500:
 *         description: Server error
 */
virtualTryOnRoute.post(
  '/',
  authMiddleware,
  upload.fields([
    { name: 'humanImage', maxCount: 1 },
    { name: 'clothImage', maxCount: 1 }
  ]),
  virtualTryOn
);
export default virtualTryOnRoute;

