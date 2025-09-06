import { Router } from 'express';
import { cakeCreate, cakeList, cakeDetail, cakeByKeyword, listCakeByType, cakeCreateMany, deleteCake, updateCake, updateImage, deleteImage } from '../controllers/cake.controller';
import multer from 'multer';
export const upload = multer({
    storage: multer.memoryStorage(),
});

const cakeRoute: Router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Cake:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - typeId
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the cake.
 *         description:
 *           type: string
 *           description: The description of the cake.
 *         price:
 *           type: number
 *           description: The price of the cake.
 *         image:
 *           type: array
 *           items:
 *             type: string
 *           description: List of image URLs of the cake.
 *         ingredients:
 *           type: string
 *           description: Ingredients of the cake.
 *         typeId:
 *           type: integer
 *           description: The ID of the cake type.
 */

/**
 * @swagger
 * /cake/list:
 *   get:
 *     summary: Get the list of all cakes
 *     tags: [Cakes]
 *     responses:
 *       200:
 *         description: A list of cakes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cake'
 *       500:
 *         description: Internal server error
 */
cakeRoute.get('/list', cakeList);

/**
 * @swagger
 * /cake/search:
 *   get:
 *     summary: Search cakes by keyword (name or description)
 *     tags: [Cakes]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: Keyword to search cakes by name or description
 *     responses:
 *       200:
 *         description: A list of cakes matching the keyword
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cake'
 *       400:
 *         description: Invalid keyword provided
 *       500:
 *         description: Internal server error
 */
cakeRoute.get('/search', cakeByKeyword);

/**
 * @swagger
 * /cake/type/{type}:
 *   get:
 *     summary: Get cakes by type
 *     tags: [Cakes]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: The type of cake to filter by
 *     responses:
 *       200:
 *         description: A list of cakes by type
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cake'
 *       500:
 *         description: Internal server error
 */
cakeRoute.get('/type/:type', listCakeByType);

/**
 * @swagger
 * /cake/{id}:
 *   get:
 *     summary: Get a cake by its ID
 *     tags: [Cakes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique ID of the cake
 *     responses:
 *       200:
 *         description: A single cake
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cake'
 *       404:
 *         description: Cake not found
 *       500:
 *         description: Internal server error
 */
cakeRoute.get('/:id', cakeDetail);

/**
 * @swagger
 * /cake/create:
 *   post:
 *     summary: Create a new cake with optional images
 *     tags: [Cakes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cake'
 *     responses:
 *       201:
 *         description: Cake created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cake'
 *       500:
 *         description: Internal server error
 */
cakeRoute.post('/create',
    upload.fields([
        { name: 'mainImage', maxCount: 1 }, // One main image
        { name: 'extraImages', maxCount: 4 }, // Up to 4 extra images
    ]),
    cakeCreate);

/**
 * @swagger
 * /cake/createMany:
 *   post:
 *     summary: Bulk create cakes
 *     tags: [Cakes]
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
 *         description: Cakes created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cake'
 *       500:
 *         description: Internal server error
 */
cakeRoute.post('/createMany', cakeCreateMany);

/**
 * @swagger
 * /cake/update/{id}:
 *   put:
 *     summary: Update an existing cake
 *     tags: [Cakes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the cake to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cake'
 *     responses:
 *       200:
 *         description: Cake updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cake'
 *       404:
 *         description: Cake not found
 *       500:
 *         description: Internal server error
 */
cakeRoute.put('/update/:id', updateCake);

/**
 * @swagger
 * /cake/delete/{id}:
 *   delete:
 *     summary: Delete a cake by its ID
 *     tags: [Cakes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the cake to delete
 *     responses:
 *       200:
 *         description: Cake deleted successfully
 *       404:
 *         description: Cake not found
 *       500:
 *         description: Internal server error
 */
cakeRoute.delete('/delete/:id', deleteCake);

/**
 * @swagger
 * /cake/deleteImage/{cakeId}:
 *   delete:
 *     summary: Delete a specific image from a cake
 *     tags: [Cakes]
 *     parameters:
 *       - in: path
 *         name: cakeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the cake to delete an image from
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
cakeRoute.delete('/deleteImage/:id', deleteImage);

/**
 * @swagger
 * /cake/updateImage/{id}:
 *   put:
 *     summary: Update images (main and extra) of an existing cake
 *     tags: [Cakes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the cake to update images for
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               mainImage:
 *                 type: file
 *                 description: The main image of the cake (optional)
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
    ]),
    updateImage);

export default cakeRoute;
