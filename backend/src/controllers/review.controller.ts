import { Request, Response } from 'express';
import { Review } from '../models/Review.js';
import { Studio } from '../models/Studio.js';
import { Product } from '../models/Product.js';
import { AuthRequest } from '../middleware/auth.js';

export const addReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Please login to write a review' });
      return;
    }

    const { targetType, targetId, rating, title, comment, photos } = req.body;

    const review = await Review.create({
      targetType,
      targetId,
      userId: req.user.id,
      rating: Number(rating),
      title,
      comment,
      photos: photos || [],
      isVerifiedPurchase: true,
      isApproved: true
    });

    // Update target average rating
    const allReviews = await Review.find({ targetType, targetId, isApproved: true });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    if (targetType === 'studio') {
      await Studio.findByIdAndUpdate(targetId, {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length
      });
    } else if (targetType === 'product') {
      await Product.findByIdAndUpdate(targetId, {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length
      });
    }

    const populatedReview = await Review.findById(review._id).populate('userId', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review posted successfully!',
      review: populatedReview
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const replyToReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }

    review.studioReply = {
      comment,
      repliedAt: new Date()
    };
    await review.save();

    res.json({
      success: true,
      message: 'Reply added successfully',
      review
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviewsByTarget = async (req: Request, res: Response): Promise<void> => {
  try {
    const { targetType, targetId } = req.params;

    const reviews = await Review.find({ targetType, targetId, isApproved: true })
      .sort({ createdAt: -1 })
      .populate('userId', 'name avatar');

    res.json({
      success: true,
      reviews
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
