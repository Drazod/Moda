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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = require("../configs");
const __1 = require("..");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    token = token.split(' ')[1]; // Extract token part
    try {
        if (!configs_1.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const payload = jsonwebtoken_1.default.verify(token, configs_1.JWT_SECRET);
        const user = yield __1.prisma.user.findFirst({
            where: {
                id: payload.id,
                role: payload.role,
                email: payload.email,
            },
        });
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ message: "Unauthorized: Token expired" });
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        return res.status(401).json({ message: "Unauthorized" });
    }
});
exports.default = authMiddleware;
