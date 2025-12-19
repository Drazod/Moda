import { Request, Response } from 'express';
import { c2cListingService } from '../services/c2cListing.services';
import { ClothesCondition, ListingStatus } from '@prisma/client';
import { uploadToFirebase } from '../services/upload.services';
import { checkInventory, removeFromInventory } from '../services/inventory.services';
import { prisma } from '..';

export const c2cListingController = {
  /**
   * POST /api/c2c/listings
   * Create a new C2C listing
   */
  async createListing(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const {
        clothesId,
        sizeId,
        condition,
        description,
        price
      } = req.body;

      // Validation
      if (!clothesId || !condition || !description || !price) {
        return res.status(400).json({
          message: 'Missing required fields: clothesId, condition, description, price'
        });
      }

      if (!Object.values(ClothesCondition).includes(condition)) {
        return res.status(400).json({
          message: `Invalid condition. Must be one of: ${Object.values(ClothesCondition).join(', ')}`
        });
      }

      if (price <= 0) {
        return res.status(400).json({ message: 'Price must be greater than 0' });
      }

      // Handle image uploads (upload.array puts files directly in req.files as array)
      const files = req.files as Express.Multer.File[];

      if (!files || !files.length) {
        return res.status(400).json({ message: 'At least one image is required' });
      }

      if (files.length > 5) {
        return res.status(400).json({ message: 'Maximum 5 images allowed' });
      }

      // Validate clothesId and sizeId first
      const clothes = await prisma.clothes.findUnique({
        where: { id: Number(clothesId) },
        include: { sizes: true }
      });

      if (!clothes) {
        return res.status(400).json({
          message: `Invalid clothesId: ${clothesId}. Only store clothing can be listed.`
        });
      }

      if (sizeId) {
        const validSize = clothes.sizes.find(s => s.id === Number(sizeId));
        if (!validSize) {
          return res.status(400).json({
            message: `Invalid sizeId: ${sizeId}. This size does not belong to clothing ${clothesId}.`
          });
        }

        // Check if user owns this item in their inventory
        const hasInventory = await checkInventory(userId, Number(clothesId), Number(sizeId), 1);
        if (!hasInventory) {
          return res.status(400).json({
            message: 'You do not own this item. You can only list clothes from your inventory.'
          });
        }
      } else {
        return res.status(400).json({
          message: 'Size is required for listing. You can only list clothes you own.'
        });
      }

      // Transaction: Upload images, create listing, and lock inventory
      const result = await prisma.$transaction(async (tx) => {
        // Upload all images to Firebase
        const uploadedImages = await Promise.all(
          files.map(async (file: Express.Multer.File, index: number) => {
            const imageName = Date.now() + "_" + file.originalname;
            const imageUrl = await uploadToFirebase({ ...file, originalname: imageName });
            return {
              url: imageUrl,
              order: index
            };
          })
        );

        // Create listing directly with tx
        const listing = await tx.c2CListing.create({
          data: {
            sellerId: userId,
            clothesId: Number(clothesId),
            sizeId: sizeId ? Number(sizeId) : undefined,
            condition,
            description,
            price: Number(price),
            status: ListingStatus.ACTIVE,
            images: {
              create: uploadedImages.map((img: { url: string; order: number }) => ({
                imageUrl: img.url,
                order: img.order
              }))
            }
          },
          include: {
            seller: { select: { id: true, email: true } },
            clothes: true,
            size: true,
            images: { orderBy: { order: 'asc' } }
          }
        });

        // Remove item from seller's inventory (lock it for this listing)
        await removeFromInventory(userId, Number(clothesId), Number(sizeId), 1);

        return listing;
      });

      return res.status(201).json({
        message: 'Listing created successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Create listing error:', error);
      return res.status(400).json({
        message: error.message || 'Failed to create listing'
      });
    }
  },

  /**
   * GET /api/c2c/listings/:listingId
   * Get listing details
   */
  async getListing(req: Request, res: Response) {
    try {
      const { listingId } = req.params;

      const listing = await c2cListingService.getListing(listingId);

      return res.json({
        message: 'Listing retrieved successfully',
        data: listing
      });
    } catch (error: any) {
      console.error('Get listing error:', error);
      return res.status(404).json({
        message: error.message || 'Listing not found'
      });
    }
  },

  /**
   * GET /api/c2c/listings
   * Search listings with filters
   */
  async searchListings(req: Request, res: Response) {
    try {
      const {
        typeId,
        sizeId,
        condition,
        minPrice,
        maxPrice,
        sellerId,
        status,
        page,
        limit
      } = req.query;

      const result = await c2cListingService.searchListings({
        typeId: typeId ? Number(typeId) : undefined,
        sizeId: sizeId ? Number(sizeId) : undefined,
        condition: condition as ClothesCondition,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sellerId: sellerId ? Number(sellerId) : undefined,
        status: status as ListingStatus,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20
      });

      return res.json({
        message: 'Listings retrieved successfully',
        data: result.listings,
        pagination: result.pagination
      });
    } catch (error: any) {
      console.error('Search listings error:', error);
      return res.status(400).json({
        message: error.message || 'Failed to search listings'
      });
    }
  },

  /**
   * PATCH /api/c2c/listings/:listingId/status
   * Update listing status (seller only)
   */
  async updateStatus(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { listingId } = req.params;
      const { status } = req.body;

      if (!status || !Object.values(ListingStatus).includes(status)) {
        return res.status(400).json({
          message: `Invalid status. Must be one of: ${Object.values(ListingStatus).join(', ')}`
        });
      }

      const listing = await c2cListingService.updateListingStatus(
        listingId,
        userId,
        status
      );

      return res.json({
        message: 'Listing status updated successfully',
        data: listing
      });
    } catch (error: any) {
      console.error('Update listing status error:', error);
      return res.status(400).json({
        message: error.message || 'Failed to update listing status'
      });
    }
  },

  /**
   * GET /api/c2c/my-listings
   * Get current user's listings
   */
  async getMyListings(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const listings = await c2cListingService.getSellerListings(userId);

      return res.json({
        message: 'Your listings retrieved successfully',
        data: listings
      });
    } catch (error: any) {
      console.error('Get my listings error:', error);
      return res.status(400).json({
        message: error.message || 'Failed to retrieve listings'
      });
    }
  }
};
