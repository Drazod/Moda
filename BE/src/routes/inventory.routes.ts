import express from 'express';
import * as inventoryController from '../controllers/inventory.controller';
import authMiddleware from '../middlewares/authentication';

const router = express.Router();

// Get user's inventory
router.get('/', authMiddleware, inventoryController.getInventory);

// Get specific inventory item
router.get('/:clothesId/:sizeId', authMiddleware, inventoryController.getInventoryItem);

// Check inventory availability
router.post('/check', authMiddleware, inventoryController.checkInventoryAvailability);

export default router;
