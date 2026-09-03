"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewsByTarget = exports.replyToReview = exports.addReview = void 0;
const Review_js_1 = require("../models/Review.js");
const Studio_js_1 = require("../models/Studio.js");
const Product_js_1 = require("../models/Product.js");
const addReview = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Please login to write a review' });
            return;
        }
        const { targetType, targetId, rating, title, comment, photos } = req.body;
        const review = await Review_js_1.Review.create({
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
        const allReviews = await Review_js_1.Review.find({ targetType, targetId, isApproved: true });
        const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
        if (targetType === 'studio') {
            await Studio_js_1.Studio.findByIdAndUpdate(targetId, {
                rating: Math.round(avgRating * 10) / 10,
                reviewCount: allReviews.length
            });
        }
        else if (targetType === 'product') {
            await Product_js_1.Product.findByIdAndUpdate(targetId, {
                rating: Math.round(avgRating * 10) / 10,
                reviewCount: allReviews.length
            });
        }
        const populatedReview = await Review_js_1.Review.findById(review._id).populate('userId', 'name avatar');
        res.status(201).json({
            success: true,
            message: 'Review posted successfully!',
            review: populatedReview
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.addReview = addReview;
const replyToReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        const review = await Review_js_1.Review.findById(id);
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.replyToReview = replyToReview;
const getReviewsByTarget = async (req, res) => {
    try {
        const { targetType, targetId } = req.params;
        const reviews = await Review_js_1.Review.find({ targetType, targetId, isApproved: true })
            .sort({ createdAt: -1 })
            .populate('userId', 'name avatar');
        res.json({
            success: true,
            reviews
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getReviewsByTarget = getReviewsByTarget;
