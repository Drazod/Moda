import { Router } from 'express';
import {
  getAllTypes,
  createType,
  getTypeById,
  updateType,
  deleteType
} from '../controllers/type.controller';
import authMiddleware from '../middlewares/authentication';
import authorize from '../middlewares/authorization';

const typeRoute: Router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         name:
 *           category: string
 *           description: The name of the cake type.
 *       required:
 *         - name
 */

/**
 * @swagger
 * /category/list:
 *   get:
 *     summary: Retrieve a list of all clothes categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Successfully retrieved list of clothes categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Type'
 *       500:
 *         description: Internal server error
 */
typeRoute.get('/list', getAllTypes);

/**
 * @swagger
 * /category/create:
 *   post:
 *     summary: Create a new clothes category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Type'
 *     responses:
 *       201:
 *         description: Successfully created a new clothes category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category created successfully!"
 *                 type:
 *                   $ref: '#/components/schemas/Type'
 *       500:
 *         description: Internal server error
 */
typeRoute.post('/create',authMiddleware,authorize(["admin"]), createType);

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Retrieve a clothes category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the clothes category
 *     responses:
 *       200:
 *         description: Successfully retrieved the clothes category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Type'
 *       500:
 *         description: Internal server error
 */
typeRoute.get('/:id',authMiddleware,authorize(["admin"]), getTypeById);

/**
 * @swagger
 * /category/update/{id}:
 *   put:
 *     summary: Update a clothes category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the clothes category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Type'
 *     responses:
 *       200:
 *         description: Successfully updated the clothes category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category updated successfully"
 *                 type:
 *                   $ref: '#/components/schemas/Type'
 *       500:
 *         description: Internal server error
 */
typeRoute.put('/update/:id',authMiddleware,authorize(["admin"]), updateType);

/**
 * @swagger
 * /category/delete/{id}:
 *   delete:
 *     summary: Delete a clothes category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the clothes category to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the clothes category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category deleted successfully"
 *       500:
 *         description: Internal server error
 */
typeRoute.delete('/delete/:id',authMiddleware,authorize(["admin"]), deleteType);

export default typeRoute;
