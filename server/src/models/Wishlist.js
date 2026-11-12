import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    targetPriceAlert: {
      type: Number,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Ensure unique user + product combination
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);
