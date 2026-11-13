import express from 'express';
import { getDashboardInsights, getPriceInsights } from '../controllers/insightController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', optionalAuth, getDashboardInsights);
router.get('/prices', getPriceInsights);

export default router;

