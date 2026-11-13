import mongoose from 'mongoose';

const reviewSubSchema = new mongoose.Schema(
  {
    author: { type: String, default: 'Verified Buyer' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: '' },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    verified: { type: Boolean, default: true },
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative'], default: 'positive' },
  },
  { _id: false }
);

const offerSubSchema = new mongoose.Schema(
  {
    retailer: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discountPercentage: { type: Number },
    availability: { type: String, default: 'In Stock' },
    productUrl: { type: String, required: true },
    isVerified: { type: Boolean, default: true },
    lastChecked: { type: Date, default: Date.now },
  },
  { _id: false }
);

const pricePointSubSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    price: { type: Number, required: true },
    retailer: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      index: true,
    },
    subcategory: {
      type: String,
      default: '',
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
      index: true,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    retailer: {
      type: String,
      required: [true, 'Retailer is required'],
      index: true,
    },
    productUrl: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'],
    },
    description: {
      type: String,
      required: true,
    },
    specifications: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
      index: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    availability: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'In Stock',
    },
    dataSource: {
      type: String,
      enum: ['Live integration', 'Demo data', 'Access not configured', 'Temporarily unavailable'],
      default: 'Demo data',
    },
    reviews: [reviewSubSchema],
    priceHistory: [pricePointSubSchema],
    otherOffers: [offerSubSchema],
    aiScore: {
      overall: { type: Number, default: 85 },
      priceSuitability: { type: Number, default: 85 },
      specSuitability: { type: Number, default: 85 },
      reviewQuality: { type: Number, default: 85 },
      valueForMoney: { type: Number, default: 85 },
      badge: { type: String, enum: ['Best Overall', 'Best Budget', 'Best Premium', 'Best Value', 'Recommended', null], default: null },
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Full text search index
productSchema.index({ title: 'text', brand: 'text', description: 'text', category: 'text' });

export default mongoose.models.Product || mongoose.model('Product', productSchema);

