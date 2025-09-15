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
exports.userUpdate = exports.userProfile = void 0;
const __1 = require("..");
const userProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return res.status(401).json({ message: "User not authenticated" });
    const userId = req.user.id;
    try {
        const user = yield __1.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        res.status(200).json({ message: "User Profile: ", user: user });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.userProfile = userProfile;
const userUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return res.status(401).json({ message: "User not authenticated" });
    const userId = req.user.id;
    try {
        const user = yield __1.prisma.user.update({
            where: {
                id: userId
            },
            data: req.body
        });
        res.status(200).json({ message: "User updated successfully", user: user });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.userUpdate = userUpdate;
