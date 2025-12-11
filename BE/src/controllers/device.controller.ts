import { Request, Response } from 'express';
import { prisma } from '..';

/**
 * Get all devices for current user
 * GET /user/devices
 */
export const getUserDevices = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        publicKeyDevices: true,
        publicKeyUpdatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const devices = user.publicKeyDevices ? (user.publicKeyDevices as any[]) : [];

    res.status(200).json({ 
      devices,
      lastUpdated: user.publicKeyUpdatedAt
    });
  } catch (error) {
    console.error('Get user devices error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Add a new device for current user
 * POST /user/devices
 */
export const addUserDevice = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { deviceName, userAgent } = req.body;

    if (!deviceName) {
      return res.status(400).json({ message: 'Device name is required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { publicKeyDevices: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get existing devices or initialize empty array
    const existingDevices = user.publicKeyDevices ? (user.publicKeyDevices as any[]) : [];

    // Check if device already exists (by name)
    const deviceExists = existingDevices.some(
      (device: any) => device.name === deviceName
    );

    if (deviceExists) {
      return res.status(400).json({ message: 'Device with this name already exists' });
    }

    // Add new device
    const newDevice = {
      name: deviceName,
      userAgent: userAgent || req.headers['user-agent'] || 'Unknown',
      addedAt: new Date().toISOString(),
      lastUsedAt: new Date().toISOString()
    };

    const updatedDevices = [...existingDevices, newDevice];

    // Update user with new devices array
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        publicKeyDevices: updatedDevices,
        publicKeyUpdatedAt: new Date()
      }
    });

    res.status(201).json({
      message: 'Device added successfully',
      device: newDevice,
      totalDevices: updatedDevices.length
    });
  } catch (error) {
    console.error('Add user device error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update device last used timestamp
 * PUT /user/devices/:deviceName/activity
 */
export const updateDeviceActivity = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { deviceName } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { publicKeyDevices: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const devices = user.publicKeyDevices ? (user.publicKeyDevices as any[]) : [];
    const deviceIndex = devices.findIndex((d: any) => d.name === deviceName);

    if (deviceIndex === -1) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Update last used timestamp
    devices[deviceIndex].lastUsedAt = new Date().toISOString();

    await prisma.user.update({
      where: { id: req.user.id },
      data: { publicKeyDevices: devices }
    });

    res.status(200).json({
      message: 'Device activity updated',
      device: devices[deviceIndex]
    });
  } catch (error) {
    console.error('Update device activity error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Remove a device
 * DELETE /user/devices/:deviceName
 */
export const removeUserDevice = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { deviceName } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { publicKeyDevices: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const devices = user.publicKeyDevices ? (user.publicKeyDevices as any[]) : [];
    const updatedDevices = devices.filter((d: any) => d.name !== deviceName);

    if (devices.length === updatedDevices.length) {
      return res.status(404).json({ message: 'Device not found' });
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { 
        publicKeyDevices: updatedDevices,
        publicKeyUpdatedAt: new Date()
      }
    });

    res.status(200).json({
      message: 'Device removed successfully',
      remainingDevices: updatedDevices.length
    });
  } catch (error) {
    console.error('Remove user device error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Rename a device
 * PATCH /user/devices/:deviceName
 */
export const renameUserDevice = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { deviceName } = req.params;
    const { newName } = req.body;

    if (!newName) {
      return res.status(400).json({ message: 'New device name is required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { publicKeyDevices: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const devices = user.publicKeyDevices ? (user.publicKeyDevices as any[]) : [];
    const deviceIndex = devices.findIndex((d: any) => d.name === deviceName);

    if (deviceIndex === -1) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Check if new name already exists
    const nameExists = devices.some((d: any) => d.name === newName);
    if (nameExists) {
      return res.status(400).json({ message: 'A device with this name already exists' });
    }

    // Update device name
    devices[deviceIndex].name = newName;
    devices[deviceIndex].renamedAt = new Date().toISOString();

    await prisma.user.update({
      where: { id: req.user.id },
      data: { publicKeyDevices: devices }
    });

    res.status(200).json({
      message: 'Device renamed successfully',
      device: devices[deviceIndex]
    });
  } catch (error) {
    console.error('Rename user device error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
