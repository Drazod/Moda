import { Router } from 'express';
import { clothesCreate, clothesList, clothesDetail, clothesByKeyword, listClothesByCategory, clothesCreateMany, deleteClothes, updateClothes, updateImage, deleteImage } from '../controllers/cake.controller';
import authMiddleware from '../middlewares/authentication';
import authorize from '../middlewares/authorization';
import multer from 'multer';
export const upload = multer({
    storage: multer.memoryStorage(),
});

const cakeRoute: Router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Clothes:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - categoryId
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the clothes.
 *         description:
 *           type: string
 *           description: The description of the clothes.
 *         price:
 *           type: number
 *           description: The price of the clothes.
 *         image:
 *           type: array
 *           items:
 *             type: string
 *           description: List of image URLs of the clothes.
 *         categoryId:
 *           type: integer
 *           description: The ID of the clothes category.
 */

/**
 * @swagger
 * /clothes/list:
 *   get:
 *     summary: Get the list of all clothes
 *     tags: [Clothes]
 *     responses:
 *       200:
 *         description: A list of clothes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clothes'
 *       500:
 *         description: Internal server error
 */
cakeRoute.get('/list', clothesList);

/**
 * @swagger
 * /clothes/search:
 *   get:
 *     summary: Search clothes by keyword (name or description)
 *     tags: [Clothes]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: Keyword to search clothes by name or description
 *     responses:
 *       200:
 *         description: A list of cakes matching the keyword
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clothes'
 *       400:
 *         description: Invalid keyword provided
 *       500:
 *         description: Internal server error
 */
cakeRoute.get('/search', clothesByKeyword);

/**
 * @swagger
 * /clothes/category/{category}:
 *   get:
 *     summary: Get clothes by category
 *     tags: [Clothes]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: The category of clothes to filter by
 *     responses:
 *       200:
 *         description: A list of clothes by category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clothes'
 *       500:
 *         description: Internal server error
 */
cakeRoute.get('/category/:category', listClothesByCategory);

/**
 * @swagger
 * /clothes/{id}:
 *   get:
 *     summary: Get a clothes by its ID
 *     tags: [Clothes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique ID of the clothes
 *     responses:
 *       200:
 *         description: A single clothes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cake'
 *       404:
 *         description: Cake not found
 *       500:
 *         description: Internal server error
 */
cakeRoute.get('/:id', clothesDetail);

/**
/**
 * @swagger
 * /clothes/create:
 *   post:
 *     summary: Create a new clothes with images
 *     tags: [Clothes]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               mainImage:
 *                 type: string
 *                 format: binary
 *               extraImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Clothes created successfully
 */
cakeRoute.post('/create',
    upload.fields([
        { name: 'mainImage', maxCount: 1 }, // One main image
        { name: 'extraImages', maxCount: 4 }, // Up to 4 extra images
    ]), authMiddleware, authorize(["ADMIN"]),
    clothesCreate);


/**
 * @swagger
 * /clothes/createMany:
 *   post:
 *     summary: Bulk create clothes
 *     tags: [Clothes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Cake'
 *     responses:
 *       201:
 *         description: Clothes created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clothes'
 *       500:
 *         description: Internal server error
 */
cakeRoute.post('/createMany', clothesCreateMany);

/**
 * @swagger
 * /clothes/update/{id}:
 *   put:
 *     summary: Update an existing clothes
 *     tags: [Clothes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the clothes to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Clothes'
 *     responses:
 *       200:
 *         description: Cake updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clothes'
 *       404:
 *         description: Cake not found
 *       500:
 *         description: Internal server error
 */
cakeRoute.put('/update/:id',authMiddleware,authorize(["ADMIN"]), updateClothes);

/**
 * @swagger
 * /clothes/delete/{id}:
 *   delete:
 *     summary: Delete a cake by its ID
 *     tags: [Clothes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the clothes to delete
 *     responses:
 *       200:
 *         description: Clothes deleted successfully
 *       404:
 *         description: Clothes not found
 *       500:
 *         description: Internal server error
 */
cakeRoute.delete('/delete/:id',authMiddleware,authorize(["ADMIN"]), deleteClothes);

/**
 * @swagger
 * /clothes/deleteImage/{clothesId}:
 *   delete:
 *     summary: Delete a specific image from a clothes
 *     tags: [Clothes]
 *     parameters:
 *       - in: path
 *         name: clothesId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the clothes to delete an image from
 *       - in: query
 *         name: imageName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the image to delete (e.g., 'mainImage' or 'extraImage1')
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       404:
 *         description: Cake or image not found
 *       500:
 *         description: Internal server error
 */
cakeRoute.delete('/deleteImage/:id',authMiddleware, authorize(["ADMIN"]), deleteImage);

/**
 * @swagger
 * /clothes/updateImage/{id}:
 *   put:
 *     summary: Update images (main and extra) of an existing clothes
 *     tags: [Clothes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the clothes to update images for
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               mainImage:
 *                 type: file
 *                 description: The main image of the clothes (optional)
 *               extraImages:
 *                 type: array
 *                 items:
 *                   type: file
 *                 description: Up to 4 extra images for the cake
 *     responses:
 *       200:
 *         description: Images updated successfully
 *       404:
 *         description: Cake not found
 *       500:
 *         description: Internal server error
 */
cakeRoute.put('/updateImage/:id',
    upload.fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'extraImages', maxCount: 4 },
    ]), authMiddleware, authorize(["ADMIN"]),
    updateImage);

export default cakeRoute;
