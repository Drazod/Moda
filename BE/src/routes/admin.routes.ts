// src/routes/admin.overview.route.ts
import { Router } from 'express';
import { getAdminOverview } from '../controllers/admin.controller';
import authMiddleware from '../middlewares/authentication';
import authorize from '../middlewares/authorization';
import router from './vnpay.routes';

const adminRoute: Router = Router();

adminRoute.get(
  '/overview',
  authMiddleware,
  authorize(['ADMIN']), // adjust if you have 'HOST' etc.
  getAdminOverview
);

export default adminRoute;

// app.ts
// app.use('/api/admin', adminOverviewRouter);
