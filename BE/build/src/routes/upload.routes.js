"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const express_1 = require("express");
const upload_services_1 = require("../services/upload.services");
// import { upload, storage } from '..';
const multer_1 = __importDefault(require("multer"));
exports.upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
});
const typeRoute = (0, express_1.Router)();
// typeRoute.post('/upload', 
//     upload.array("images", 5), 
//     uploadImages);
typeRoute.post('/upload', exports.upload.fields([
    { name: 'mainImage', maxCount: 1 }, // One main image
    { name: 'extraImages', maxCount: 4 }, // Up to 4 extra images
]), upload_services_1.uploadImages);
// typeRoute.delete('/delete', deleteImageFromFirebaseAndPrisma);
exports.default = typeRoute;
