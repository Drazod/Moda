import { PrismaClient, ClothesCondition, ListingStatus } from '@prisma/client';
import { addToInventory } from './inventory.services';

const prisma = new PrismaClient();

export const c2cListingService = {
  /**
   * Create a new C2C listing
   * VALIDATION: Ensures clothesId exists in store catalog and sizeId belongs to that clothesId
   */
  async createListing(data: {
    sellerId: number;
    clothesId: number;
    sizeId?: number;
    condition: ClothesCondition;
    description: string;
    price: number;
    images?: string[];
  }) {
    // Step 1: Validate clothesId exists in store catalog
    const clothes = await prisma.clothes.findUnique({
      where: { id: data.clothesId },
      include: { sizes: true }
    });

    if (!clothes) {
      throw new Error(`Invalid clothesId: ${data.clothesId}. Only store clothing can be listed.`);
    }

    // Step 2: Validate sizeId belongs to this clothesId
    if (data.sizeId) {
      const validSize = clothes.sizes.find(size => size.id === data.sizeId);
      if (!validSize) {
        throw new Error(
          `Invalid sizeId: ${data.sizeId}. This size does not belong to clothing ${data.clothesId}.`
        );
      }
    }

    // Step 3: Create listing with images
    const listing = await prisma.c2CListing.create({
      data: {
        sellerId: data.sellerId,
        clothesId: data.clothesId,
        sizeId: data.sizeId,
        condition: data.condition,
        description: data.description,
        price: data.price,
        status: ListingStatus.ACTIVE,
        images: data.images
          ? {
              create: data.images.map((url, index) => ({
                imageUrl: url,
                order: index
              }))
            }
          : undefined
      },
      include: {
        seller: { select: { id: true, email: true } },
        clothes: true,
        size: true,
        images: { orderBy: { order: 'asc' } }
      }
    });

    return listing;
  },

  /**
   * Get listing details
   */
  async getListing(listingId: string) {
    const listing = await prisma.c2CListing.findUnique({
      where: { id: listingId },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            c2cReputation: true
          }
        },
        clothes: {
          select: {
            id: true,
            name: true
          }
        },
        size: {
          select: {
            id: true,
            label: true
          }
        },
        images: { orderBy: { order: 'asc' } }
      }
    });

    if (!listing) {
      throw new Error('Listing not found');
    }

    return listing;
  },

  /**
   * Search listings with filters
   */
  async searchListings(filters: {
    typeId?: number;
    sizeId?: number;
    condition?: ClothesCondition;
    minPrice?: number;
    maxPrice?: number;
    sellerId?: number;
    status?: ListingStatus;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.typeId) {
      where.clothes = { typeId: filters.typeId };
    }

    if (filters.sizeId) {
      where.sizeId = filters.sizeId;
    }

    if (filters.condition) {
      where.condition = filters.condition;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    if (filters.sellerId) {
      where.sellerId = filters.sellerId;
    }

    if (filters.status) {
      where.status = filters.status;
    } else {
      // Default: only show ACTIVE listings
      where.status = ListingStatus.ACTIVE;
    }

    const [listings, total] = await Promise.all([
      prisma.c2CListing.findMany({
        where,
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              c2cReputation: true
            }
          },
          clothes: {
            select: {
              id: true,
              name: true
            }
          },
          size: {
            select: {
              id: true,
              label: true
            }
          },
          images: { orderBy: { order: 'asc' }, take: 1 }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.c2CListing.count({ where })
    ]);

    return {
      listings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  /**
   * Update listing status (seller only)
   */
  async updateListingStatus(
    listingId: string,
    sellerId: number,
    status: ListingStatus
  ) {
    // Verify seller owns this listing
    const listing = await prisma.c2CListing.findUnique({
      where: { id: listingId }
    });

    if (!listing) {
      throw new Error('Listing not found');
    }

    if (listing.sellerId !== sellerId) {
      throw new Error('Only the seller can update this listing');
    }

    // Don't allow changing SOLD listings
    if (listing.status === ListingStatus.SOLD) {
      throw new Error('Cannot modify sold listings');
    }

    // If cancelling an active listing, return item to inventory
    const shouldReturnToInventory = 
      (listing.status === ListingStatus.ACTIVE || listing.status === ListingStatus.RESERVED) &&
      (status === ListingStatus.CANCELLED || status === ListingStatus.INACTIVE) &&
      listing.sizeId;

    const updated = await prisma.$transaction(async (tx) => {
      const updatedListing = await tx.c2CListing.update({
        where: { id: listingId },
        data: { status },
        include: {
          seller: { select: { id: true, name: true } },
          clothes: {
            select: {
              id: true,
              name: true
            }
          },
          size: {
            select: {
              id: true,
              label: true
            }
          },
          images: { orderBy: { order: 'asc' } }
        }
      });

      // Return item to inventory if cancelling
      if (shouldReturnToInventory && listing.sizeId) {
        await addToInventory(
          sellerId,
          listing.clothesId,
          listing.sizeId,
          1,
          'STORE', // Original source
          `cancelled_listing_${listingId}`
        );
      }

      return updatedListing;
    });

    return updated;
  },

  /**
   * Get seller's listings
   */
  async getSellerListings(sellerId: number) {
    return prisma.c2CListing.findMany({
      where: { sellerId },
      include: {
        clothes: {
          select: {
            id: true,
            name: true
          }
        },
        size: {
          select: {
            id: true,
            label: true
          }
        },
        images: { orderBy: { order: 'asc' }, take: 1 }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
};
