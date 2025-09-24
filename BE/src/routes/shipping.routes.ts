import { Router } from "express";
import { updateShippingState } from "../controllers/shipping.controller";
import authMiddleware from "../middlewares/authentication";
import authorize from "../middlewares/authorization";

const shippingRoute = Router();

shippingRoute.put("/:id/state", authMiddleware, authorize(["ADMIN"]), updateShippingState);

export default shippingRoute;
