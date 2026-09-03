import { Response } from 'express';
import { Wishlist } from '../models/Wishlist.js';
import { AuthRequest } from '../middleware/auth.js';

export const getWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    let wishlist = await Wishlist.findOne({ userId: req.user.id })
      .populate('studios')
      .populate('products');

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, studios: [], products: [] });
    }

    res.json({
      success: true,
      wishlist
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleWishlistStudio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { studioId } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, studios: [studioId], products: [] });
    } else {
      const exists = wishlist.studios.some(id => id.toString() === studioId);
      if (exists) {
        wishlist.studios = wishlist.studios.filter(id => id.toString() !== studioId);
      } else {
        wishlist.studios.push(studioId as any);
      }
      await wishlist.save();
    }

    const populated = await Wishlist.findById(wishlist._id).populate('studios').populate('products');

    res.json({
      success: true,
      wishlist: populated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleWishlistProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, studios: [], products: [productId] });
    } else {
      const exists = wishlist.products.some(id => id.toString() === productId);
      if (exists) {
        wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
      } else {
        wishlist.products.push(productId as any);
      }
      await wishlist.save();
    }

    const populated = await Wishlist.findById(wishlist._id).populate('studios').populate('products');

    res.json({
      success: true,
      wishlist: populated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
