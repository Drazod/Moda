import { Router } from 'express';
import { uploadImages, deleteImageFromFirebaseAndPrisma } from '../services/upload.services';
// import { upload, storage } from '..';

import multer from 'multer';
export const upload = multer({
    storage: multer.memoryStorage(),
});

const typeRoute: Router = Router();

// typeRoute.post('/upload', 
//     upload.array("images", 5), 
//     uploadImages);

typeRoute.post('/upload', 
    upload.fields([
        { name: 'mainImage', maxCount: 1 }, // One main image
        { name: 'extraImages', maxCount: 4 }, // Up to 4 extra images
      ]), 
    uploadImages);

// typeRoute.delete('/delete', deleteImageFromFirebaseAndPrisma);

export default typeRoute;

/**
 * @swagger
 * /file/upload:
 *   post:
 *     summary: Upload main and extra images
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               mainImage:
 *                 type: string
 *                 format: binary
 *                 description: Main image
 *               extraImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Extra images (max 4)
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 main:
 *                   type: string
 *                   description: Public URL of main image
 *                 additional:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Public URLs of extra images
 *       400:
 *         description: Missing images
 *       500:
 *         description: Internal server error
 */
