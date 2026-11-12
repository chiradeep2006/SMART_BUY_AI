import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist, checkWishlistStatus } from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:id', removeFromWishlist);
router.get('/check/:productId', checkWishlistStatus);

export default router;
