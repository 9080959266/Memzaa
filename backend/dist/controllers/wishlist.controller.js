"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleWishlistProduct = exports.toggleWishlistStudio = exports.getWishlist = void 0;
const Wishlist_js_1 = require("../models/Wishlist.js");
const getWishlist = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        let wishlist = await Wishlist_js_1.Wishlist.findOne({ userId: req.user.id })
            .populate('studios')
            .populate('products');
        if (!wishlist) {
            wishlist = await Wishlist_js_1.Wishlist.create({ userId: req.user.id, studios: [], products: [] });
        }
        res.json({
            success: true,
            wishlist
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getWishlist = getWishlist;
const toggleWishlistStudio = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const { studioId } = req.body;
        let wishlist = await Wishlist_js_1.Wishlist.findOne({ userId: req.user.id });
        if (!wishlist) {
            wishlist = await Wishlist_js_1.Wishlist.create({ userId: req.user.id, studios: [studioId], products: [] });
        }
        else {
            const exists = wishlist.studios.some(id => id.toString() === studioId);
            if (exists) {
                wishlist.studios = wishlist.studios.filter(id => id.toString() !== studioId);
            }
            else {
                wishlist.studios.push(studioId);
            }
            await wishlist.save();
        }
        const populated = await Wishlist_js_1.Wishlist.findById(wishlist._id).populate('studios').populate('products');
        res.json({
            success: true,
            wishlist: populated
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.toggleWishlistStudio = toggleWishlistStudio;
const toggleWishlistProduct = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const { productId } = req.body;
        let wishlist = await Wishlist_js_1.Wishlist.findOne({ userId: req.user.id });
        if (!wishlist) {
            wishlist = await Wishlist_js_1.Wishlist.create({ userId: req.user.id, studios: [], products: [productId] });
        }
        else {
            const exists = wishlist.products.some(id => id.toString() === productId);
            if (exists) {
                wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
            }
            else {
                wishlist.products.push(productId);
            }
            await wishlist.save();
        }
        const populated = await Wishlist_js_1.Wishlist.findById(wishlist._id).populate('studios').populate('products');
        res.json({
            success: true,
            wishlist: populated
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.toggleWishlistProduct = toggleWishlistProduct;
