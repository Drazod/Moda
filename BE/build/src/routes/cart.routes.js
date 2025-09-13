"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const cartRoute = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the cart
 *         userId:
 *           type: integer
 *           description: The ID of the user who owns the cart (automatically assigned from the authenticated user)
 *         state:
 *           type: string
 *           description: The current state of the cart (e.g., PENDING, ORDERED)
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               cake:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   description:
 *                     type: string
 *               quantity:
 *                 type: integer
 *                 description: The quantity of this particular cake in the cart
 */
/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get all carts (admin only)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all carts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Internal server error
 */
cartRoute.get('/view', authentication_1.default, cart_controller_1.getCart);
/**
 * @swagger
 * /cart/{id}:
 *   get:
 *     summary: Get a cart by its ID
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the cart
 *     responses:
 *       200:
 *         description: A single cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
cartRoute.get('/:id', authentication_1.default, cart_controller_1.getCartById);
/**
 * @swagger
 * /cart/create:
 *   post:
 *     summary: Create a new cart for the authenticated user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Cart created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Internal server error
 */
cartRoute.post('/create', authentication_1.default, cart_controller_1.createCart);
/**
 * @swagger
 * /cart/update/{id}:
 *   put:
 *     summary: Update an existing cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the cart to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *                 description: The new state of the cart (e.g., PENDING, ORDERED)
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
cartRoute.put('/update/:id', authentication_1.default, cart_controller_1.updateCart);
/**
 * @swagger
 * /cart/placeOrder/{id}:
 *   put:
 *     summary: Place an order for the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the cart to place the order for
 *     responses:
 *       200:
 *         description: Cart order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
cartRoute.put('/placeOrder/:id', authentication_1.default, cart_controller_1.placeOrder);
/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cakeId:
 *                 type: integer
 *                 description: The ID of the cake to add
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the cake to add
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/CartItem'
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Internal server error
 */
cartRoute.post('/add', authentication_1.default, cart_controller_1.addCartItemToCart);
/**
 * @swagger
 * /cart/view:
 *   get:
 *     summary: View items in the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of items in the user's cart
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Internal server error
 */
cartRoute.get('/view', authentication_1.default, cart_controller_1.viewCartItemInCart);
/**
 * @swagger
 * /cart/update:
 *   put:
 *     summary: Update a cart item in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartItemId:
 *                 type: integer
 *                 description: The ID of the cart item to update
 *               quantity:
 *                 type: integer
 *                 description: The new quantity of the item
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cartItem:
 *                   $ref: '#/components/schemas/CartItem'
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */
cartRoute.put('/update', authentication_1.default, cart_controller_1.updateCartItemInCart);
/**
 * @swagger
 * /cart/delete:
 *   delete:
 *     summary: Remove a cart item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartItemId:
 *                 type: integer
 *                 description: The ID of the cart item to delete
 *     responses:
 *       200:
 *         description: Cart item deleted successfully
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */
cartRoute.delete('/delete', authentication_1.default, cart_controller_1.deleteCartItemFromCart);
cartRoute.delete('/delete/:id', authentication_1.default, cart_controller_1.deleteCart);
exports.default = cartRoute;
