import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { getDBStatus } from './config/db.js';
import { getGeminiModel } from './config/gemini.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import compareRoutes from './routes/compareRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import insightRoutes from './routes/insightRoutes.js';

dotenv.config();

const app = express();

// Security and utility middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// System Health Check
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  const geminiAvailable = Boolean(getGeminiModel());

  res.json({
    status: 'healthy',
    name: 'SmartBuy AI API Service',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    aiService: {
      provider: 'Google Gemini AI',
      active: geminiAvailable,
      mode: geminiAvailable ? 'Live Gemini 1.5' : 'Deterministic Local Fallback',
    },
    version: '1.0.0',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products', compareRoutes); // handles /api/products/compare
app.use('/api/compare', compareRoutes);  // also accessible at /api/compare
app.use('/api/ai', aiRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/search/history', historyRoutes);
app.use('/api/insights', insightRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
