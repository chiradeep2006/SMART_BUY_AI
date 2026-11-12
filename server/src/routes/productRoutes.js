import express from 'express';
import { getProducts, getProductById, getCategories, getRetailers } from '../controllers/productController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getProducts);
router.get('/categories', getCategories);
router.get('/retailers', getRetailers);
router.get('/:id', getProductById);

export default router;
