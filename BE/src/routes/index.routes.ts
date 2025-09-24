import { Router } from "express";
import authRoute from "./auth.routes";
import cakeRoute from "./cake.routes";
import cartRoute from "./cart.routes";
import typeRoute from "./type.routes";
import cartItemRoute from "./cartItem.routes";
import userRoute from "./user.routes";
import vnpayRoutes from "./vnpay.routes"; // Add this line
import uploadRoute from "./upload.routes"; // Add this line

import logRoute from "./log.routes";
import noticeRoute from "./notice.routes";
import adminRoute from "./admin.routes"; // Add this line
import metricRoute from "./metric.routes";
import reportRoute from "./report.routes";
import searchRoute from "./search.routes";

import shippingRoute from "./shipping.routes";
import orderRoute from "./order.routes";
import couponRoute from "./coupon.routes";

const route = Router();

route.use('/auth', authRoute);
route.use('/clothes', cakeRoute);
route.use('/cart', cartRoute);
route.use('/category', typeRoute);
route.use('/cartItem', cartItemRoute);
route.use('/user', userRoute);
route.use('/vnpay', vnpayRoutes); 
route.use('/file', uploadRoute);
route.use('/admin', adminRoute);
route.use('/metrics', metricRoute);
route.use('/report', reportRoute);
route.use('/notice', noticeRoute);
route.use('/log', logRoute);
route.use('/search', searchRoute);
route.use('/shipping', shippingRoute);
route.use('/coupon', couponRoute);
route.use('/order', orderRoute);

export default route;