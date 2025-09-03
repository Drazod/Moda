import { Router } from 'express';
import {
  getAllTypes,
  createType,
  getTypeById,
  updateType,
  deleteType
} from '../controllers/type.controller';

const typeRoute: Router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Type:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the cake type.
 *       required:
 *         - name
 */

/**
 * @swagger
 * /type/list:
 *   get:
 *     summary: Retrieve a list of all cake types
 *     tags: [Types]
 *     responses:
 *       200:
 *         description: Successfully retrieved list of cake types
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
 * /type/create:
 *   post:
 *     summary: Create a new cake type
 *     tags: [Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Type'
 *     responses:
 *       201:
 *         description: Successfully created a new cake type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Type created successfully!"
 *                 type:
 *                   $ref: '#/components/schemas/Type'
 *       500:
 *         description: Internal server error
 */
typeRoute.post('/create', createType);

/**
 * @swagger
 * /type/{id}:
 *   get:
 *     summary: Retrieve a cake type by ID
 *     tags: [Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the cake type
 *     responses:
 *       200:
 *         description: Successfully retrieved the cake type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Type'
 *       500:
 *         description: Internal server error
 */
typeRoute.get('/:id', getTypeById);

/**
 * @swagger
 * /type/update/{id}:
 *   put:
 *     summary: Update a cake type by ID
 *     tags: [Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the cake type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Type'
 *     responses:
 *       200:
 *         description: Successfully updated the cake type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Type updated successfully"
 *                 type:
 *                   $ref: '#/components/schemas/Type'
 *       500:
 *         description: Internal server error
 */
typeRoute.put('/update/:id', updateType);

/**
 * @swagger
 * /type/delete/{id}:
 *   delete:
 *     summary: Delete a cake type by ID
 *     tags: [Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the cake type to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the cake type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Type deleted successfully"
 *       500:
 *         description: Internal server error
 */
typeRoute.delete('/delete/:id', deleteType);

export default typeRoute;
