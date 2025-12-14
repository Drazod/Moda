import { Router } from 'express';
import { c2cListingController } from '../controllers/c2cListing.controller';
import authenticate from '../middlewares/authentication';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = Router();

/**
 * @route POST /api/c2c/listings
 * @desc Create a new C2C listing
 * @access Private (authenticated users)
 * @body {
 *   clothesId: number,
 *   sizeId?: number,
 *   condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR',
 *   description: string,
 *   price: number,
 *   images: File[] (max 5 images)
 * }
 */
router.post('/listings', upload.array('images', 5), authenticate, c2cListingController.createListing);

// All other C2C listing routes require authentication
router.use(authenticate);

/**
 * @route GET /api/c2c/listings/:listingId
 * @desc Get listing details
 * @access Public
 */
router.get('/listings/:listingId', c2cListingController.getListing);

/**
 * @route GET /api/c2c/listings
 * @desc Search listings with filters
 * @access Public
 * @query {
 *   typeId?: number,
 *   sizeId?: number,
 *   condition?: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR',
 *   minPrice?: number,
 *   maxPrice?: number,
 *   sellerId?: number,
 *   status?: 'ACTIVE' | 'RESERVED' | 'SOLD' | 'CANCELLED' | 'INACTIVE',
 *   page?: number,
 *   limit?: number
 * }
 */
router.get('/listings', c2cListingController.searchListings);

/**
 * @route PATCH /api/c2c/listings/:listingId/status
 * @desc Update listing status (seller only)
 * @access Private (listing owner)
 * @body { status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' }
 */
router.patch('/listings/:listingId/status', c2cListingController.updateStatus);

/**
 * @route GET /api/c2c/my-listings
 * @desc Get current user's listings
 * @access Private (authenticated users)
 */
router.get('/my-listings', c2cListingController.getMyListings);

export default router;
