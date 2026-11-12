import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

export const getWishlist = async (req, res, next) => {
  try {
    const wishlistItems = await Wishlist.find({ user: req.user._id })
      .populate('product')
      .sort({ createdAt: -1 });

    const validItems = wishlistItems.filter((item) => item.product != null);

    res.json({
      success: true,
      count: validItems.length,
      wishlist: validItems,
    });
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const { productId, targetPriceAlert, notes } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const existing = await Wishlist.findOne({ user: req.user._id, product: productId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Product is already in your wishlist' });
    }

    const item = await Wishlist.create({
      user: req.user._id,
      product: productId,
      targetPriceAlert: targetPriceAlert || null,
      notes: notes || '',
    });

    const populated = await Wishlist.findById(item._id).populate('product');

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      item: populated,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { id } = req.params; // Can be wishlist item _id or product _id

    const deleted = await Wishlist.findOneAndDelete({
      user: req.user._id,
      $or: [{ _id: id }, { product: id }],
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Wishlist item not found' });
    }

    res.json({
      success: true,
      message: 'Product removed from wishlist',
      removedId: deleted._id,
    });
  } catch (error) {
    next(error);
  }
};

export const checkWishlistStatus = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const exists = await Wishlist.exists({ user: req.user._id, product: productId });

    res.json({
      success: true,
      inWishlist: Boolean(exists),
    });
  } catch (error) {
    next(error);
  }
};
