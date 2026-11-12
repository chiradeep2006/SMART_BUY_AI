import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import connectDB from '../src/config/db.js';
import Product from '../src/models/Product.js';
import User from '../src/models/User.js';
import { SEED_PRODUCTS } from '../src/data/seedProducts.js';

describe('SmartBuy AI Backend API Test Suite', () => {
  let authToken = '';
  let testUserId = '';
  let sampleProductId = '';

  beforeAll(async () => {
    await connectDB();
    // Seed test products if not present
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(SEED_PRODUCTS);
    }
    const sample = await Product.findOne();
    if (sample) sampleProductId = sample._id.toString();
  });

  describe('1. Health Check Endpoint', () => {
    it('GET /api/health should return status healthy', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.name).toBe('SmartBuy AI API Service');
    });
  });

  describe('2. Authentication Flow', () => {
    const testEmail = `testuser_${Date.now()}@smartbuy.ai`;
    const testPassword = 'Password123!';

    it('POST /api/auth/register should create a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test QA Engineer',
          email: testEmail,
          password: testPassword,
          language: 'ta',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(testEmail);
      expect(res.body.user.preferences.language).toBe('ta');

      authToken = res.body.token;
      testUserId = res.body.user.id;
    });

    it('POST /api/auth/register should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate User',
          email: testEmail,
          password: testPassword,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });

    it('POST /api/auth/login should authenticate user with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it('POST /api/auth/login should reject incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword123!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/auth/me should return current authenticated user profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(testEmail);
    });

    it('GET /api/auth/me should reject request without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('3. Product Catalog & Search API', () => {
    it('GET /api/products should return product list with AI scores and provider statuses', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.products)).toBe(true);
      expect(res.body.providers).toBeDefined();
      expect(res.body.providers.length).toBeGreaterThan(0);
    });

    it('GET /api/products/categories should return all 20 universal categories', async () => {
      const res = await request(app).get('/api/products/categories');
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(20);
      expect(res.body.categories.length).toBe(20);
    });

    it('GET /api/products/retailers should return all retailer platforms with integration statuses', async () => {
      const res = await request(app).get('/api/products/retailers');
      expect(res.status).toBe(200);
      expect(res.body.retailers.length).toBeGreaterThan(15);
      const statuses = res.body.retailers.map((r) => r.status);
      expect(statuses.some((s) => ['Live integration', 'Demo data', 'Access not configured'].includes(s))).toBe(true);
    });

    it('GET /api/products?q=laptop should perform search and NLP query extraction', async () => {
      const res = await request(app).get('/api/products?q=laptop under 60000');
      expect(res.status).toBe(200);
      expect(res.body.parsedNLP).toBeDefined();
      expect(res.body.parsedNLP.budget).toBe(60000);
    });

    it('GET /api/products/:id should return single product details', async () => {
      const res = await request(app).get(`/api/products/${sampleProductId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.product._id).toBe(sampleProductId);
    });
  });

  describe('4. Product Comparison API', () => {
    it('POST /api/compare/compare should compare 2 products side-by-side with AI badges', async () => {
      const products = await Product.find().limit(2);
      const pIds = products.map((p) => p._id.toString());

      const res = await request(app)
        .post('/api/compare/compare')
        .send({ productIds: pIds });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.comparison.products.length).toBe(2);
      expect(res.body.comparison.aiSummary).toBeDefined();
      expect(res.body.comparison.bestOverallId).toBeDefined();
    });

    it('POST /api/compare/compare should reject less than 2 products', async () => {
      const res = await request(app)
        .post('/api/compare/compare')
        .send({ productIds: [sampleProductId] });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('5. Wishlist API (Protected)', () => {
    it('POST /api/wishlist should add product to user wishlist', async () => {
      const res = await request(app)
        .post('/api/wishlist')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: sampleProductId });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.item.product).toBeDefined();
    });

    it('GET /api/wishlist should return user saved items', async () => {
      const res = await request(app)
        .get('/api/wishlist')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.count).toBeGreaterThanOrEqual(1);
    });

    it('DELETE /api/wishlist/:id should remove product from wishlist', async () => {
      const res = await request(app)
        .delete(`/api/wishlist/${sampleProductId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('6. AI Researcher Endpoints', () => {
    it('POST /api/ai/parse-search should extract category, budget and specs', async () => {
      const res = await request(app)
        .post('/api/ai/parse-search')
        .send({ query: 'Best laptop under 60000 for programming' });

      expect(res.status).toBe(200);
      expect(res.body.parsed.budget).toBe(60000);
      expect(res.body.parsed.category).toBe('Laptops and computers');
    });

    it('POST /api/ai/analyze-reviews should analyze real reviews for a product', async () => {
      const res = await request(app)
        .post('/api/ai/analyze-reviews')
        .send({ productId: sampleProductId });

      expect(res.status).toBe(200);
      expect(res.body.available).toBe(true);
      expect(res.body.sentiment).toBeDefined();
    });

    it('POST /api/ai/chat should respond with contextual shopping advice', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({ message: 'Recommend a good laptop for coding', language: 'en' });

      expect(res.status).toBe(200);
      expect(res.body.reply).toBeDefined();
    });
  });
});
