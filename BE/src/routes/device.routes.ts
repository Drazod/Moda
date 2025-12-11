import { Router } from 'express';
import { 
  getUserDevices, 
  addUserDevice, 
  updateDeviceActivity,
  removeUserDevice,
  renameUserDevice
} from '../controllers/device.controller';
import authenticate from '../middlewares/authentication';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all devices
router.get('/', getUserDevices);

// Add new device
router.post('/', addUserDevice);

// Update device activity (last used)
router.put('/:deviceName/activity', updateDeviceActivity);

// Rename device
router.patch('/:deviceName', renameUserDevice);

// Remove device
router.delete('/:deviceName', removeUserDevice);

export default router;
