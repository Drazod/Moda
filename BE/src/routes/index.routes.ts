import { Router } from "express";
import authRoute from "./auth.routes";
import cakeRoute from "./cake.routes";
import cartRoute from "./cart.routes";
import typeRoute from "./type.routes";
import cartItemRoute from "./cartItem.routes";
import userRoute from "./user.routes";
import vnpayRoutes from "./vnpay.routes"; // Add this line
import uploadRoute from "./upload.routes"; // Add this line


const route = Router();

route.use('/auth', authRoute);
route.use('/cake', cakeRoute);
route.use('/cart', cartRoute);
route.use('/type', typeRoute);
route.use('/cartItem', cartItemRoute);
route.use('/user', userRoute);
route.use('/vnpay', vnpayRoutes); 
route.use('/file', uploadRoute);

export default route;