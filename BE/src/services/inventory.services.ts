import { prisma } from "..";
import { InventorySource } from "@prisma/client";

// Add item to user's inventory
export const addToInventory = async (
  userId: number,
  clothesId: number,
  sizeId: number,
  quantity: number,
  source: InventorySource,
  sourceReference?: string
) => {
  // Check if item already exists in inventory with same source reference
  const existingItem = await prisma.inventory.findFirst({
    where: {
      userId,
      clothesId,
      sizeId,
      sourceReference: sourceReference || null,
    },
  });

  if (existingItem) {
    // Update quantity
    return await prisma.inventory.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
  } else {
    // Create new inventory item
    return await prisma.inventory.create({
      data: {
        userId,
        clothesId,
        sizeId,
        quantity,
        source,
        sourceReference,
      },
    });
  }
};

// Remove item from user's inventory
export const removeFromInventory = async (
  userId: number,
  clothesId: number,
  sizeId: number,
  quantity: number
) => {
  // Find inventory items (FIFO - oldest first)
  const inventoryItems = await prisma.inventory.findMany({
    where: {
      userId,
      clothesId,
      sizeId,
      quantity: { gt: 0 },
    },
    orderBy: {
      acquiredAt: 'asc', // FIFO
    },
  });

  let remainingToRemove = quantity;

  for (const item of inventoryItems) {
    if (remainingToRemove <= 0) break;

    const toRemove = Math.min(item.quantity, remainingToRemove);

    if (toRemove >= item.quantity) {
      // Remove entire item
      await prisma.inventory.delete({
        where: { id: item.id },
      });
    } else {
      // Reduce quantity
      await prisma.inventory.update({
        where: { id: item.id },
        data: {
          quantity: item.quantity - toRemove,
        },
      });
    }

    remainingToRemove -= toRemove;
  }

  if (remainingToRemove > 0) {
    throw new Error(`Insufficient inventory. Missing ${remainingToRemove} items.`);
  }
};

// Check if user has enough items in inventory
export const checkInventory = async (
  userId: number,
  clothesId: number,
  sizeId: number,
  quantity: number
): Promise<boolean> => {
  const totalQuantity = await prisma.inventory.aggregate({
    where: {
      userId,
      clothesId,
      sizeId,
    },
    _sum: {
      quantity: true,
    },
  });

  return (totalQuantity._sum.quantity || 0) >= quantity;
};

// Get user's inventory
export const getUserInventory = async (userId: number) => {
  return await prisma.inventory.findMany({
    where: { userId },
    include: {
      clothes: {
        include: {
          mainImg: true,
          category: true,
        },
      },
      size: true,
    },
    orderBy: {
      acquiredAt: 'desc',
    },
  });
};

// Get inventory for specific item
export const getInventoryItem = async (
  userId: number,
  clothesId: number,
  sizeId: number
) => {
  const inventoryItems = await prisma.inventory.findMany({
    where: {
      userId,
      clothesId,
      sizeId,
    },
    include: {
      clothes: {
        include: {
          mainImg: true,
          category: true,
        },
      },
      size: true,
    },
  });

  const totalQuantity = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items: inventoryItems,
    totalQuantity,
  };
};
