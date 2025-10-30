// src/routes/admin.routes.ts
import { Router } from 'express';
import { getAdminOverview, getAllUsersForAdmin, createAdminAccount } from '../controllers/admin.controller';
import authMiddleware from '../middlewares/authentication';
import authorize from '../middlewares/authorization';

const adminRoute: Router = Router();

adminRoute.get(
  '/overview',
  authMiddleware,
  authorize(['ADMIN', 'HOST']), // adjust if you have 'HOST' etc.
  getAdminOverview
);

// Admin: Get list of users (id, name, role, isVerified)
adminRoute.get('/users', authMiddleware, authorize(['ADMIN', 'HOST']), getAllUsersForAdmin);

// Secure admin creation endpoint (only SUPER_ADMIN)
adminRoute.post('/create-admin', authMiddleware, authorize(['HOST']), createAdminAccount);

export default adminRoute;

// app.ts
// app.use('/api/admin', adminOverviewRouter);
