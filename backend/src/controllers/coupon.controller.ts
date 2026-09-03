import { Request, Response } from 'express';
import { Coupon } from '../models/Coupon.js';

export const getActiveCoupons = async (req: Request, res: Response): Promise<void> => {
  try {
    const coupons = await Coupon.find({ 
      isActive: true, 
      validTill: { $gte: new Date() } 
    }).sort({ discountPercent: -1 });

    res.json({
      success: true,
      coupons
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, orderAmount = 0 } = req.body;

    if (!code) {
      res.status(400).json({ success: false, message: 'Please enter a coupon code' });
      return;
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
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
    } else if (coupon.flatDiscount > 0) {
      discount = Math.min(coupon.flatDiscount, orderAmount);
    }

    res.json({
      success: true,
      valid: true,
      coupon,
      discountAmount: Math.round(discount),
      message: `Coupon '${coupon.code}' is valid! You save ₹${Math.round(discount)}`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      code,
      description,
      discountPercent,
      flatDiscount,
      minOrderAmount = 0,
      maxDiscountAmount = 5000,
      validTill,
      usageLimit = 1000
    } = req.body;

    const coupon = await Coupon.create({
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCouponsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      coupons
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
