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
exports.deleteCartItem = exports.updateCartItem = exports.createCartItem = exports.getCartItemById = exports.getCartItem = void 0;
const __1 = require("..");
const getCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartItem = yield __1.prisma.cartItem.findMany({
            include: {
                cake: true,
                cart: true
            },
        });
        res.status(200).json({ cartItem });
    }
    catch (error) {
        console.error("Error getting cart item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getCartItem = getCartItem;
const getCartItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const cartItem = yield __1.prisma.cartItem.findUnique({
            where: { id: parseInt(id) },
            include: {
                cake: true,
                cart: true
            },
        });
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        res.status(200).json({ cartItem });
    }
    catch (error) {
        console.error("Error getting cart item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getCartItemById = getCartItemById;
const createCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartId, cakeId, quantity } = req.body;
    try {
        const cake = yield __1.prisma.cake.findUnique({ where: { id: cakeId } });
        if (!cake) {
            return res.status(404).json({ message: "Cake not found" });
        }
        const totalprice = cake.price * quantity;
        const cartItem = yield __1.prisma.cartItem.create({
            data: {
                cartId,
                cakeId,
                quantity,
                totalprice
            },
        });
        res.status(201).json({ cartItem });
    }
    catch (error) {
        console.error("Error creating cart item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createCartItem = createCartItem;
const updateCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { quantity } = req.body;
    try {
        const cartItem = yield __1.prisma.cartItem.findUnique({ where: { id: parseInt(id) } });
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        const cake = yield __1.prisma.cake.findUnique({ where: { id: cartItem.cakeId } });
        if (!cake) {
            return res.status(404).json({ message: "Cake not found" });
        }
        const totalprice = cake.price * quantity;
        const updatedCartItem = yield __1.prisma.cartItem.update({
            where: { id: parseInt(id) },
            data: {
                quantity,
                totalprice
            },
        });
        res.status(200).json({ updatedCartItem });
    }
    catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateCartItem = updateCartItem;
const deleteCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const cartItem = yield __1.prisma.cartItem.findUnique({ where: { id: parseInt(id) } });
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        yield __1.prisma.cartItem.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: "Cart item deleted" });
    }
    catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteCartItem = deleteCartItem;
