import express from 'express';

import {
	addToWishlist,
	deleteFromWishlist,
	getAllWishlist,
	generateWishlistFromFilters,
} from '../controllers/wishlist.controller.js';
import { generateLimiter } from '../middleware/rateLimits.js';

const router = express.Router();

router.get('/', getAllWishlist);
router.post('/', addToWishlist);
router.delete('/', deleteFromWishlist);
router.post('/generate', generateLimiter, generateWishlistFromFilters);

export default router;
