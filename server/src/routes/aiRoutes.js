import express from 'express';
import { parseSearchQuery, getRecommendations, analyzeReviews, chatAssistant } from '../controllers/aiController.js';

const router = express.Router();

router.post('/parse-search', parseSearchQuery);
router.post('/recommend', getRecommendations);
router.post('/analyze-reviews', analyzeReviews);
router.post('/chat', chatAssistant);

export default router;

