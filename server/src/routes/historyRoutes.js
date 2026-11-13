import express from 'express';
import { getSearchHistory, deleteHistoryItem, clearSearchHistory } from '../controllers/historyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getSearchHistory);
router.delete('/:id', deleteHistoryItem);
router.delete('/', clearSearchHistory);

export default router;

