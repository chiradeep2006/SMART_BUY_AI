# SmartBuy AI – Intelligent Shopping Researcher

SmartBuy AI is a production-ready, full-stack intelligent shopping researcher and product discovery platform built with **React**, **Vite**, **Node.js**, **Express**, **MongoDB/Mongoose**, and **Google Gemini AI**.

It replaces biased sponsored ad rankings with **deterministic, algorithmic product suitability scoring**, provides **side-by-side technical specification comparison**, tracks **verified historical price drops**, synthesizes **authentic customer reviews**, and offers full **11-language Indian localization** (English, Hindi, Tamil, Telugu, Malayalam, Kannada, Bengali, Marathi, Gujarati, Punjabi, Odia).

---

## 🌟 Key Highlights & Architecture

### 1. Universal Shopping Categories
Supports **20 universal categories** with extensible data schemas:
1. Electronics
2. Smartphones
3. Laptops and computers
4. Fashion and clothing
5. Shoes and footwear
6. Watches and accessories
7. Beauty and skincare
8. Home and furniture
9. Kitchen appliances
10. Grocery and food
11. Sports and fitness
12. Automotive accessories
13. Books and stationery
14. Toys and baby products
15. Jewellery
16. Pet supplies
17. Travel accessories
18. Gaming products
19. Musical instruments
20. Other products

### 2. Transparent Retailer Integrations
Integrates with leading marketplaces across India and globally with transparent status indicators:
- **India General:** Amazon India, Flipkart, Meesho, JioMart, Snapdeal
- **India Fashion:** Myntra, AJIO, Tata CLiQ, Nykaa Fashion
- **India Electronics:** Croma, Reliance Digital, Vijay Sales, Poorvika
- **India Beauty:** Nykaa, Purplle, Tira
- **India Grocery:** BigBasket, Blinkit, Zepto, Swiggy Instamart
- **India Home:** IKEA India, Pepperfry, Urban Ladder
- **International:** Amazon Global, eBay, Walmart, Best Buy, Target

Each retailer is explicitly categorized with live status tags:
- `Live integration` (when official API or feed is configured)
- `Demo data` (verified representative catalog data)
- `Access not configured`
- `Temporarily unavailable`

### 3. Global Multilingual System (11 Languages)
Seamless, instant website localization across:
- **English** (`en`)
- **Hindi – हिंदी** (`hi`)
- **Tamil – தமிழ்** (`ta`)
- **Telugu – తెలుగు** (`te`)
- **Malayalam – മലയാളം** (`ml`)
- **Kannada – ಕನ್ನಡ** (`kn`)
- **Bengali – বাংলা** (`bn`)
- **Marathi – मराठी** (`mr`)
- **Gujarati – ગુજરાતી** (`gu`)
- **Punjabi – ਪੰਜਾਬੀ** (`pa`)
- **Odia – ଓଡ଼ିଆ** (`or`)

Preferences persist in `localStorage` for guests and sync to MongoDB User Profiles for authenticated accounts.

### 4. Deterministic AI Recommendation Engine
Unlike search engines that prioritize paid promotions, SmartBuy AI calculates a transparent mathematical score based on verified data:
- **Price Suitability (35%):** Proximity and optimal utilization of user budget
- **Specification Suitability (30%):** Hardware specs match and data completeness
- **Review Quality (20%):** Verified customer ratings and sentiment volume
- **Value for Money (15%):** Feature-to-price ratio and verified discounts

Badges awarded:
- **Best Overall**
- **Best Budget**
- **Best Premium**
- **Best Value**

### 5. Gemini-Powered Shopping Assistant & Review Analyzer
- Natural language query parser (e.g. *"Best laptop under ₹60,000 for programming"*, *"Running shoes under ₹3,000"*).
- Context-aware shopping chat with inline product recommendation cards.
- Objective review analyzer extracting positive strengths, common complaints, and overall buyer sentiment without fabricating reviews.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Axios, Recharts, Lucide React, i18next & react-i18next.
- **Backend:** Node.js (ESM), Express 4, MongoDB & Mongoose, Google Gemini AI SDK, JWT, bcryptjs, Zod, Helmet, Morgan, CORS.
- **Testing:** Vitest, React Testing Library, Supertest, jsdom.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18+ recommended, v20 or v24 verified)
- npm or pnpm

### 1. Clone the repository
```bash
git clone <repository_url>
cd SMART_AI
```

### 2. Install dependencies
```bash
# Root dependencies
npm install

# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
cd ..
```

### 3. Environment Variables
Create `.env` in root or `server/`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/smartbuy_ai
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```
*(Note: If no local MongoDB is running, the server automatically starts a zero-configuration embedded in-memory MongoDB server).*

### 4. Run Development Servers
```bash
# Run both Backend & Frontend concurrently
npm run dev

# Or run separately:
npm run dev:server  # Server on http://localhost:5000
npm run dev:client  # Client on http://localhost:5173
```

---

## 🧪 Testing

### Backend Unit & Integration Tests (20 Tests)
```bash
npm run test:server
```
Verifies:
- System Health endpoint (`/api/health`)
- User Registration, Password Hashing & Duplicate Handling
- User Login & JWT verification
- Protected Routes & Session Retrieval (`/api/auth/me`)
- Universal Categories (all 20)
- Retailer Platforms & Live/Demo Statuses
- Natural Language Query Parsing & Budget Extraction
- Product Details & Catalog Search
- Side-by-Side Comparison Engine & Mathematical Badging
- Wishlist Operations (Add, View, Remove)
- Gemini AI Chat, Recommendations & Review Analysis

### Frontend Unit & Component Tests (5 Tests)
```bash
npm run test:client
```
Verifies:
- Main Navigation & Header
- 11 Indian Localization Bundles loaded
- Real-time Language Switching to Tamil (தமிழ்) & Hindi (हिंदी)
- Natural Language Search Input Placeholder Rendering

### Production Build Verification
```bash
npm run build
```
Creates minified, tree-shaken, production-optimized bundles in `client/dist`.

---

## 🌐 Deployment Instructions

### 1. Frontend on Vercel
1. Import the project repository into [Vercel](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Set **Build Command** to `npm run build` and **Output Directory** to `dist`.
4. Add environment variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://smartbuy-api.onrender.com/api`).
5. Deploy. `client/vercel.json` ensures all client-side routes redirect cleanly to `index.html`.

### 2. Backend on Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Set **Root Directory** to `server`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Add environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random secret string.
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `CLIENT_URL`: Your Vercel frontend URL.
6. Deploy. Health check endpoint: `GET /api/health`.

### 3. Database on MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and whitelist IP `0.0.0.0/0` for cloud deployment.
3. Obtain connection string: `mongodb+srv://<user>:<password>@cluster.mongodb.net/smartbuy_ai?retryWrites=true&w=majority`.
4. Set as `MONGODB_URI` in Render.

---

## 📄 License
MIT License. Built for intelligent shopping research.
