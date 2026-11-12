import mongoose from 'mongoose';

const priceHistoryRecordSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    retailer: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

priceHistoryRecordSchema.index({ product: 1, recordedAt: 1 });

export default mongoose.models.PriceHistory || mongoose.model('PriceHistory', priceHistoryRecordSchema);
