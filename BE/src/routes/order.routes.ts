import { Router } from "express";
import { getOrderListForAdmin } from "../controllers/order.controller";
import authMiddleware from "../middlewares/authentication";
import authorize from "../middlewares/authorization";

const orderRoute = Router();

// GET /order/admin-list
orderRoute.get("/admin-list", authMiddleware, authorize(["ADMIN", "HOST"]), getOrderListForAdmin);

export default orderRoute;
