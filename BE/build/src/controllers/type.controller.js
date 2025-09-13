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
exports.deleteType = exports.updateType = exports.getTypeById = exports.createType = exports.getAllTypes = void 0;
const __1 = require("..");
const getAllTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const types = yield __1.prisma.type.findMany();
        res.status(200).json(types);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllTypes = getAllTypes;
const createType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = yield __1.prisma.type.create({
            data: Object.assign({}, req.body)
        });
        res.status(201).json({ message: "Type created successfully!", type });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createType = createType;
const getTypeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const type = yield __1.prisma.type.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        res.status(200).json(type);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getTypeById = getTypeById;
const updateType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const type = yield __1.prisma.type.update({
            where: {
                id: parseInt(id)
            },
            data: Object.assign({}, req.body)
        });
        res.status(200).json({ message: "Type updated successfully", type });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateType = updateType;
const deleteType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleteType = yield __1.prisma.type.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.status(200).json({ message: "Type deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteType = deleteType;
