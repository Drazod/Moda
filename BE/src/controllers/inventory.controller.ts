import { Request, Response } from 'express';
import * as inventoryService from '../services/inventory.services';

// Get user's inventory
export const getInventory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const inventory = await inventoryService.getUserInventory(userId);
    res.status(200).json(inventory);
  } catch (error: any) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get specific inventory item
export const getInventoryItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { clothesId, sizeId } = req.params;

    const inventoryItem = await inventoryService.getInventoryItem(
      userId,
      parseInt(clothesId),
      parseInt(sizeId)
    );

    res.status(200).json(inventoryItem);
  } catch (error: any) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ message: error.message });
  }
};

// Check if user has item in inventory
export const checkInventoryAvailability = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { clothesId, sizeId, quantity } = req.body;

    const hasInventory = await inventoryService.checkInventory(
      userId,
      parseInt(clothesId),
      parseInt(sizeId),
      parseInt(quantity)
    );

    res.status(200).json({ available: hasInventory });
  } catch (error: any) {
    console.error('Error checking inventory:', error);
    res.status(500).json({ message: error.message });
  }
};
