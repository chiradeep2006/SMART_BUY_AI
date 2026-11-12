import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    query: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'All',
    },
    filters: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    resultsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

searchHistorySchema.index({ user: 1, createdAt: -1 });

export default mongoose.models.SearchHistory || mongoose.model('SearchHistory', searchHistorySchema);
