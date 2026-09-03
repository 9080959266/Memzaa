import { Response } from 'express';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { AuthRequest } from '../middleware/auth.js';

const recalculateCart = async (cart: any) => {
  let subtotal = 0;
  for (const item of cart.items) {
    item.itemTotal = item.unitPrice * item.quantity;
    subtotal += item.itemTotal;
  }
  cart.subtotal = subtotal;

  let discount = 0;
  if (cart.couponCode) {
    const coupon = await Coupon.findOne({ code: cart.couponCode.toUpperCase(), isActive: true });
    if (coupon && subtotal >= coupon.minOrderAmount) {
      if (coupon.discountPercent > 0) {
        discount = Math.min((subtotal * coupon.discountPercent) / 100, coupon.maxDiscountAmount);
      } else if (coupon.flatDiscount > 0) {
        discount = Math.min(coupon.flatDiscount, subtotal);
      }
    } else {
      cart.couponCode = undefined;
    }
  }

  cart.discount = Math.round(discount);
  cart.deliveryFee = subtotal > 1500 ? 0 : 99; // Free delivery above ₹1500
  cart.total = Math.max(0, cart.subtotal - cart.discount + cart.deliveryFee);

  await cart.save();
  return cart;
};

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    cart = await recalculateCart(cart);

    res.json({
      success: true,
      cart
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { productId, quantity = 1, customization } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      res.status(404).json({ success: false, message: 'Product not available' });
      return;
    }

    let unitPrice = product.discountPrice || product.basePrice;

    // Check size price offset
    if (customization?.size && product.customizationOptions?.sizes) {
      const selectedSize = product.customizationOptions.sizes.find(s => s.name === customization.size);
      if (selectedSize && selectedSize.priceOffset) {
        unitPrice += selectedSize.priceOffset;
      }
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    // Add as new item (customized products are unique)
    cart.items.push({
      productId: product._id,
      quantity: Number(quantity),
      unitPrice,
      customization,
      itemTotal: unitPrice * Number(quantity)
    } as any);

    await recalculateCart(cart);

    const populatedCart = await Cart.findById(cart._id).populate('items.productId');

    res.json({
      success: true,
      message: `${product.title} added to cart!`,
      cart: populatedCart
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      res.status(404).json({ success: false, message: 'Cart not found' });
      return;
    }

    const item = cart.items.find(i => i._id?.toString() === itemId);
    if (!item) {
      res.status(404).json({ success: false, message: 'Item not found in cart' });
      return;
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i._id?.toString() !== itemId);
    } else {
      item.quantity = Number(quantity);
      item.itemTotal = item.unitPrice * item.quantity;
    }

    await recalculateCart(cart);
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');

    res.json({
      success: true,
      message: 'Cart updated',
      cart: populatedCart
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { itemId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      res.status(404).json({ success: false, message: 'Cart not found' });
      return;
    }

    cart.items = cart.items.filter(i => i._id?.toString() !== itemId);
    await recalculateCart(cart);

    const populatedCart = await Cart.findById(cart._id).populate('items.productId');

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: populatedCart
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const applyCartCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { code } = req.body;
    if (!code) {
      res.status(400).json({ success: false, message: 'Please enter a coupon code' });
      return;
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      res.status(400).json({ success: false, message: 'Invalid or expired coupon code' });
      return;
    }

    if (new Date() > new Date(coupon.validTill)) {
      res.status(400).json({ success: false, message: 'Coupon code has expired' });
      return;
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ success: false, message: 'Cart is empty' });
      return;
    }

    if (cart.subtotal < coupon.minOrderAmount) {
      res.status(400).json({ 
        success: false, 
        message: `Coupon requires a minimum order value of ₹${coupon.minOrderAmount}` 
      });
      return;
    }

    cart.couponCode = coupon.code;
    await recalculateCart(cart);

    const populatedCart = await Cart.findById(cart._id).populate('items.productId');

    res.json({
      success: true,
      message: `Coupon '${coupon.code}' applied! Saved ₹${cart.discount}`,
      cart: populatedCart
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
