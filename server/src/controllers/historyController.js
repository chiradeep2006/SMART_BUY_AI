import SearchHistory from '../models/SearchHistory.js';

export const getSearchHistory = async (req, res, next) => {
  try {
    const history = await SearchHistory.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    res.json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHistoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await SearchHistory.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'History record not found' });
    }

    res.json({
      success: true,
      message: 'Search history record deleted',
      deletedId: id,
    });
  } catch (error) {
    next(error);
  }
};

export const clearSearchHistory = async (req, res, next) => {
  try {
    await SearchHistory.deleteMany({ user: req.user._id });
    res.json({
      success: true,
      message: 'All search history cleared successfully',
    });
  } catch (error) {
    next(error);
  }
};

