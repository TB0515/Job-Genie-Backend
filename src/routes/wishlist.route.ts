import express from 'express';

import {
	deleteFromWishlist,
	getAllWishlist,
	generateWishlistFromFilters,
} from '../controllers/wishlist.controller.js';
import { generateLimiter } from '../middleware/rateLimits.js';

const router = express.Router();

router.get('/', getAllWishlist);
router.delete('/', deleteFromWishlist);
router.post('/generate', generateLimiter, generateWishlistFromFilters);

export default router;
