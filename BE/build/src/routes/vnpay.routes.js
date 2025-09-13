"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vnpay_controller_1 = require("../controllers/vnpay.controller");
const router = express_1.default.Router();
router.post('/create-payment', vnpay_controller_1.createPayment);
router.get('/payment-return', vnpay_controller_1.handleReturn);
exports.default = router;
