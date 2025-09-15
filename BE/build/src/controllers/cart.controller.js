"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCartItemFromCart = exports.updateCartItemInCart = exports.viewCartItemInCart = exports.addCartItemToCart = exports.deleteCart = exports.placeOrder = exports.updateCart = exports.createCart = exports.getCartById = exports.getCart = void 0;
const __1 = require("..");
const client_1 = require("@prisma/client");
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return res.status(401).json({ message: "User not authenticated" });
    const userId = req.user.id;
    try {
        const cart = yield __1.prisma.cart.findFirst({
            where: { userId, state: "PENDING" },
            include: {
                items: {
                    include: {
                        cake: true,
                    },
                },
            },
        });
        res.status(200).json({ cart });
    }
    catch (error) {
        console.error("Error getting cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getCart = getCart;
const getCartById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const cart = yield __1.prisma.cart.findUnique({
            where: { id: parseInt(id) },
            include: {
                items: {
                    include: {
                        cake: true,
                    },
                },
            },
        });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json({ cart });
    }
    catch (error) {
        console.error("Error getting cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getCartById = getCartById;
const createCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const cart = yield __1.prisma.cart.create({
            data: {
                userId: req.user.id,
            },
        });
        res.status(201).json({ cart });
    }
    catch (error) {
        console.error("Error creating cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createCart = createCart;
const updateCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId } = req.body;
    try {
        const cart = yield __1.prisma.cart.update({
            where: { id: parseInt(id) },
            data: { userId },
        });
        res.status(200).json({ cart });
    }
    catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateCart = updateCart;
const placeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // const { userId } = req.body;
    try {
        const updateCart = yield __1.prisma.cart.update({
            where: { id: parseInt(id) },
            data: { state: "ORDERED" }
        });
        res.status(200).json({ updateCart });
    }
    catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.placeOrder = placeOrder;
const deleteCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return res.status(401).json({ message: "User not authenticated" });
    const userId = req.user.id;
    try {
        // Find the user's current "PENDING" cart
        const cart = yield __1.prisma.cart.findFirst({
            where: { userId, state: "PENDING" },
            include: { items: true },
        });
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        // Delete all cart items
        yield __1.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
        // Optionally, update cart state to "EMPTY" or delete the cart if desired
        // await prisma.cart.update({
        //   where: { id: cart.id },
        //   data: { state: "EMPTY" }
        // });
        // If you want to delete the cart entirely
        // await prisma.cart.delete({
        //   where: { id: cart.id },
        // });
        res.status(200).json({ message: "Cart deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteCart = deleteCart;
const addCartItemToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cakeId, quantity } = req.body;
    if (!req.user)
        return res.status(401).json({ message: "User not authenticated" });
    const userId = req.user.id;
    try {
        // Kiểm tra xem bánh có tồn tại không
        const cake = yield __1.prisma.cake.findUnique({ where: { id: cakeId } });
        if (!cake)
            return res.status(404).json({ message: "Cake not found" });
        // Tìm hoặc tạo giỏ hàng cho người dùng
        let cart = yield __1.prisma.cart.findFirst({ where: { userId: userId, state: client_1.State.PENDING } });
        if (!cart)
            cart = yield __1.prisma.cart.create({ data: { userId } });
        const existingItem = yield __1.prisma.cartItem.findFirst({
            where: { cartId: cart.id, cakeId },
        });
        const new_quantity = existingItem ? existingItem.quantity + quantity : quantity;
        if (existingItem) {
            const updatedItem = yield __1.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: new_quantity, totalprice: cake.price * (existingItem.quantity + quantity) },
            });
            return res.status(200).json({ message: "Cart updated", data: updatedItem });
        }
        else {
            const newItem = yield __1.prisma.cartItem.create({
                data: { cartId: cart.id, cakeId, quantity: new_quantity, totalprice: cake.price * new_quantity },
            });
            return res.status(201).json({ message: "Item added to cart", data: newItem });
        }
    }
    catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.addCartItemToCart = addCartItemToCart;
const viewCartItemInCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return res.status(401).json({ message: "User not authenticated" });
    const userId = req.user.id;
    try {
        // Tìm hoặc tạo giỏ hàng cho người dùng
        let cart = yield __1.prisma.cart.findFirst({ where: { userId: userId, state: client_1.State.PENDING } });
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        else {
            const cartItems = yield __1.prisma.cartItem.findMany({
                where: { cartId: cart.id },
                include: { cake: true },
            });
            return res.status(200).json({ cartItems });
        }
    }
    catch (error) {
        console.error("Error getting cart item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.viewCartItemInCart = viewCartItemInCart;
const updateCartItemInCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartItemId, quantity } = req.body;
    if (!req.user)
        return res.status(401).json({ message: "User not authenticated" });
    const userId = req.user.id;
    try {
        // Find the user's current "PENDING" cart
        const cart = yield __1.prisma.cart.findFirst({
            where: { userId, state: "PENDING" },
            include: { items: true }
        });
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        // Check if the cartItem exists and belongs to the user's cart
        const cartItem = yield __1.prisma.cartItem.findFirst({
            where: { id: cartItemId, cartId: cart.id },
            include: { cake: true },
        });
        if (!cartItem)
            return res.status(404).json({ message: "Cart item not found" });
        const newTotalPrice = cartItem.cake.price * quantity;
        // Update the CartItem with the new quantity and total price
        const updatedCartItem = yield __1.prisma.cartItem.update({
            where: { id: cartItemId },
            data: {
                quantity,
                totalprice: newTotalPrice
            },
        });
        res.status(200).json({ message: "Cart item updated", cartItem: updatedCartItem });
    }
    catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateCartItemInCart = updateCartItemInCart;
const deleteCartItemFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartItemId } = req.body;
    if (!req.user)
        return res.status(401).json({ message: "User not authenticated" });
    const userId = req.user.id;
    try {
        // Find the user's current "PENDING" cart
        const cart = yield __1.prisma.cart.findFirst({
            where: { userId, state: "PENDING" },
            include: { items: true },
        });
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        // Check if the cartItem exists and belongs to the user's cart
        const cartItem = yield __1.prisma.cartItem.findFirst({
            where: { id: cartItemId, cartId: cart.id },
        });
        if (!cartItem)
            return res.status(404).json({ message: "Cart item not found" });
        // Delete the CartItem
        yield __1.prisma.cartItem.delete({
            where: { id: cartItemId },
        });
        res.status(200).json({ message: "Cart item deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteCartItemFromCart = deleteCartItemFromCart;
