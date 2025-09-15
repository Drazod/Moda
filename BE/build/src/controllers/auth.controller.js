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
exports.someFunction = exports.changeIdentity = exports.changePassword = exports.Login = exports.Register = void 0;
const __1 = require("..");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = require("bcryptjs");
const configs_1 = require("../configs");
const Register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, phone, address } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        let user = yield __1.prisma.user.findFirst({
            where: {
                email: email,
            },
        });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        user = yield __1.prisma.user.create({
            data: {
                name,
                email,
                password: (0, bcryptjs_1.hashSync)(password, 10),
                phone,
                address,
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.Register = Register;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        let user = yield __1.prisma.user.findFirst({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(400).json({ message: "Email not found" });
        }
        if (!(0, bcryptjs_1.compareSync)(password, user.password)) {
            return res.status(400).json({ message: "Password is incorrect" });
        }
        if (!configs_1.JWT_SECRET) {
            return res.status(500).json({ message: "JWT secret is not defined" });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
        }, configs_1.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ user, token });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.Login = Login;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = yield __1.prisma.user.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (!(0, bcryptjs_1.compareSync)(oldPassword, user.password)) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }
        yield __1.prisma.user.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                password: (0, bcryptjs_1.hashSync)(newPassword, 10)
            }
        });
        res.status(200).json({ message: "Password changed" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.changePassword = changePassword;
const changeIdentity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone, address } = req.body;
        const user = yield __1.prisma.user.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                name,
                phone,
                address
            }
        });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.changeIdentity = changeIdentity;
// me -> return the logged in user
const someFunction = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    res.json(req.user);
};
exports.someFunction = someFunction;
