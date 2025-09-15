"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartItem_controller_1 = require("../controllers/cartItem.controller");
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const cartItemRoute = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the cart item
 *         cartId:
 *           type: integer
 *           description: The ID of the associated cart
 *         cakeId:
 *           type: integer
 *           description: The ID of the associated cake
 *         totalprice:
 *           type: number
 *           description: The total price for the quantity of cakes in the cart item
 *         quantity:
 *           type: integer
 *           description: The quantity of the cake in the cart item
 *         cake:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: The ID of the cake
 *             name:
 *               type: string
 *               description: The name of the cake
 *             price:
 *               type: number
 *               description: The price of the cake
 *             description:
 *               type: string
 *               description: The description of the cake
 *         cart:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: The ID of the cart
 *             userId:
 *               type: integer
 *               description: The ID of the user who owns the cart
 *             state:
 *               type: string
 *               description: The state of the cart (e.g., PENDING, ORDERED)
 */
/**
 * @swagger
 * /cartItem:
 *   get:
 *     summary: Get all cart items
 *     tags: [CartItem]
 *     responses:
 *       200:
 *         description: List of all cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 *       500:
 *         description: Internal server error
 */
cartItemRoute.get('/', authentication_1.default, cartItem_controller_1.getCartItem);
/**
 * @swagger
 * /cartItem/{id}:
 *   get:
 *     summary: Get a cart item by its ID
 *     tags: [CartItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the cart item
 *     responses:
 *       200:
 *         description: A single cart item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */
cartItemRoute.get('/:id', authentication_1.default, cartItem_controller_1.getCartItemById);
/**
 * @swagger
 * /cartItem/create:
 *   post:
 *     summary: Create a new cart item
 *     tags: [CartItem]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId:
 *                 type: integer
 *                 description: The ID of the cart
 *               cakeId:
 *                 type: integer
 *                 description: The ID of the cake
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the cake in the cart
 *     responses:
 *       201:
 *         description: Cart item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 *       404:
 *         description: Cake not found
 *       500:
 *         description: Internal server error
 */
cartItemRoute.post('/create', authentication_1.default, cartItem_controller_1.createCartItem);
/**
 * @swagger
 * /cartItem/update/{id}:
 *   put:
 *     summary: Update a cart item
 *     tags: [CartItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the cart item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: The updated quantity of the cake in the cart item
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 *       404:
 *         description: Cart item or cake not found
 *       500:
 *         description: Internal server error
 */
cartItemRoute.put('/update/:id', authentication_1.default, cartItem_controller_1.updateCartItem);
/**
 * @swagger
 * /cartItem/delete/{id}:
 *   delete:
 *     summary: Delete a cart item by ID
 *     tags: [CartItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the cart item to delete
 *     responses:
 *       200:
 *         description: Cart item deleted successfully
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */
cartItemRoute.delete('/delete/:id', authentication_1.default, cartItem_controller_1.deleteCartItem);
exports.default = cartItemRoute;
