"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const cake_routes_1 = __importDefault(require("./cake.routes"));
const route = (0, express_1.Router)();
route.use('/auth', auth_routes_1.default);
route.use('/cake', cake_routes_1.default);
// route.use('/cart', cartRoute);
// route.use('/type', typeRoute);
// route.use('/cartItem', cartItemRoute);
// route.use('/user', userRoute);
// route.use('/vnpay', vnpayRoutes); 
// route.use('/file', uploadRoute);
exports.default = route;
