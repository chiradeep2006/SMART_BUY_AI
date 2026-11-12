import app from './app.js';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import { SEED_PRODUCTS } from './data/seedProducts.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Auto-seed catalog if empty
    try {
      const count = await Product.countDocuments();
      if (count === 0) {
        console.log('[Seed] Seeding initial product catalog with verified electronics, fashion, home and beauty items...');
        await Product.insertMany(SEED_PRODUCTS);
        console.log(`[Seed] Successfully seeded ${SEED_PRODUCTS.length} products.`);
      }
    } catch (seedErr) {
      console.warn('[Seed] Product seed check skipped or failed:', seedErr.message);
    }

    // 3. Start Express server
    const server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 SmartBuy AI Backend running on port ${PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`====================================================`);
    });

    return server;
  } catch (error) {
    console.error('[Server Error] Startup failed:', error);
    process.exit(1);
  }
};

startServer();

export default app;
