import { Router } from 'express';
import { clothesCreate, clothesList, clothesDetail, clothesByKeyword, listClothesByCategory, clothesCreateMany, deleteClothes, updateClothes, updateImage, deleteImage, addClothesToBranch } from '../controllers/cake.controller';
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
 *         - sizes
 *         - features
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
 *         sizes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *               quantity:
 *                 type: integer
 *         features:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *                value:
 *                  type: string
 */

/**
 * @swagger
 * /clothes/list:
 *   get:
 *     summary: Get the list of all clothes (optionally filtered by branch stock)
 *     tags: [Clothes]
 *     parameters:
 *       - in: query
 *         name: branchCode
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional branch code to get stock quantities for a specific branch (e.g., "HCM-D1")
 *     responses:
 *       200:
 *         description: A list of clothes. If branchCode is provided, sizes show stock quantity for that branch
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   description: Default response without branchCode
 *                   items:
 *                     $ref: '#/components/schemas/Clothes'
 *                 - type: object
 *                   description: Response with branchCode filter
 *                   properties:
 *                     branch:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         code:
 *                           type: string
 *                         name:
 *                           type: string
 *                     clothes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Clothes'
 *       404:
 *         description: Branch not found (when branchCode is provided but doesn't exist)
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
 *               sizes:
 *                 type: string
 *               features:
 *                type: string
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
    ]), authMiddleware, authorize(["ADMIN", "HOST"]),
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
cakeRoute.put('/update/:id',authMiddleware,authorize(["ADMIN", "HOST"]), updateClothes);

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
cakeRoute.delete('/delete/:id',authMiddleware,authorize(["ADMIN", "HOST"]), deleteClothes);

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
cakeRoute.delete('/deleteImage/:id',authMiddleware, authorize(["ADMIN", "HOST"]), deleteImage);

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
    ]), authMiddleware, authorize(["ADMIN", "HOST"]),
    updateImage);

/**
 * @swagger
 * /clothes/{id}/add-to-branch:
 *   post:
 *     summary: Add existing clothes to an additional branch
 *     tags: [Clothes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The clothes ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - branchCode
 *               - sizes
 *             properties:
 *               branchCode:
 *                 type: string
 *                 description: The branch code (e.g., "HCM-D1")
 *                 example: "HCM-D1"
 *               sizes:
 *                 type: array
 *                 description: Array of sizes with quantities for this branch
 *                 items:
 *                   type: object
 *                   properties:
 *                     label:
 *                       type: string
 *                       description: Size label (must match existing sizes of the clothes)
 *                       example: "M"
 *                     quantity:
 *                       type: integer
 *                       description: Stock quantity for this size at this branch
 *                       example: 50
 *     responses:
 *       200:
 *         description: Successfully added clothes to branch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 branch:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     code:
 *                       type: string
 *                     name:
 *                       type: string
 *                 stocks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       branchId:
 *                         type: integer
 *                       sizeId:
 *                         type: integer
 *                       quantity:
 *                         type: integer
 *                       size:
 *                         type: object
 *       400:
 *         description: Invalid input or size label doesn't exist for this clothes
 *       404:
 *         description: Clothes or branch not found
 *       500:
 *         description: Internal server error
 */
cakeRoute.post('/:id/add-to-branch', authMiddleware, authorize(["ADMIN"]), addClothesToBranch);

export default cakeRoute;
