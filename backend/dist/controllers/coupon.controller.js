"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCouponsAdmin = exports.createCoupon = exports.validateCoupon = exports.getActiveCoupons = void 0;
const Coupon_js_1 = require("../models/Coupon.js");
const getActiveCoupons = async (req, res) => {
    try {
        const coupons = await Coupon_js_1.Coupon.find({
            isActive: true,
            validTill: { $gte: new Date() }
        }).sort({ discountPercent: -1 });
        res.json({
            success: true,
            coupons
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getActiveCoupons = getActiveCoupons;
const validateCoupon = async (req, res) => {
    try {
        const { code, orderAmount = 0 } = req.body;
        if (!code) {
            res.status(400).json({ success: false, message: 'Please enter a coupon code' });
            return;
        }
        const coupon = await Coupon_js_1.Coupon.findOne({ code: code.toUpperCase(), isActive: true });
        if (!coupon) {
            res.status(404).json({ success: false, message: 'Invalid coupon code' });
            return;
        }
        if (new Date() > new Date(coupon.validTill)) {
            res.status(400).json({ success: false, message: 'This coupon has expired' });
            return;
        }
        if (orderAmount < coupon.minOrderAmount) {
            res.status(400).json({
                success: false,
                message: `Coupon requires minimum order of ₹${coupon.minOrderAmount}`
            });
            return;
        }
        let discount = 0;
        if (coupon.discountPercent > 0) {
            discount = Math.min((orderAmount * coupon.discountPercent) / 100, coupon.maxDiscountAmount);
        }
        else if (coupon.flatDiscount > 0) {
            discount = Math.min(coupon.flatDiscount, orderAmount);
        }
        res.json({
            success: true,
            valid: true,
            coupon,
            discountAmount: Math.round(discount),
            message: `Coupon '${coupon.code}' is valid! You save ₹${Math.round(discount)}`
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.validateCoupon = validateCoupon;
const createCoupon = async (req, res) => {
    try {
        const { code, description, discountPercent, flatDiscount, minOrderAmount = 0, maxDiscountAmount = 5000, validTill, usageLimit = 1000 } = req.body;
        const coupon = await Coupon_js_1.Coupon.create({
            code: code.toUpperCase(),
            description,
            discountPercent: discountPercent || 0,
            flatDiscount: flatDiscount || 0,
            minOrderAmount,
            maxDiscountAmount,
            validTill: validTill || new Date(Date.now() + 90 * 86400000),
            usageLimit
        });
        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            coupon
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createCoupon = createCoupon;
const getAllCouponsAdmin = async (req, res) => {
    try {
        const coupons = await Coupon_js_1.Coupon.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            coupons
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllCouponsAdmin = getAllCouponsAdmin;
