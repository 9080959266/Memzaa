"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.applyCartCoupon = exports.removeCartItem = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const Cart_js_1 = require("../models/Cart.js");
const Product_js_1 = require("../models/Product.js");
const Package_js_1 = require("../models/Package.js");
const Coupon_js_1 = require("../models/Coupon.js");
const populateCartQuery = (query) => {
    return query
        .populate('items.productId')
        .populate({
        path: 'items.packageId',
        populate: [
            { path: 'studioId', select: 'name city logoImage rating address' },
            { path: 'categoryId', select: 'name slug' }
        ]
    })
        .populate('items.studioId', 'name city logoImage rating address');
};
const recalculateCart = async (cart) => {
    let subtotal = 0;
    for (const item of cart.items) {
        item.itemTotal = item.unitPrice * item.quantity;
        subtotal += item.itemTotal;
    }
    cart.subtotal = subtotal;
    let discount = 0;
    if (cart.couponCode) {
        const coupon = await Coupon_js_1.Coupon.findOne({ code: cart.couponCode.toUpperCase(), isActive: true });
        if (coupon && subtotal >= coupon.minOrderAmount) {
            if (coupon.discountPercent > 0) {
                discount = Math.min((subtotal * coupon.discountPercent) / 100, coupon.maxDiscountAmount);
            }
            else if (coupon.flatDiscount > 0) {
                discount = Math.min(coupon.flatDiscount, subtotal);
            }
        }
        else {
            cart.couponCode = undefined;
        }
    }
    cart.discount = Math.round(discount);
    cart.deliveryFee = subtotal > 1500 ? 0 : 99; // Free delivery above ₹1500
    cart.total = Math.max(0, cart.subtotal - cart.discount + cart.deliveryFee);
    await cart.save();
    return cart;
};
const getCart = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        let cart = await populateCartQuery(Cart_js_1.Cart.findOne({ userId: req.user.id }));
        if (!cart) {
            cart = await Cart_js_1.Cart.create({ userId: req.user.id, items: [] });
        }
        cart = await recalculateCart(cart);
        res.json({
            success: true,
            cart
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCart = getCart;
const addToCart = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const { productId, packageId, studioId, quantity = 1, customization } = req.body;
        if (!productId && !packageId) {
            res.status(400).json({ success: false, message: 'productId or packageId is required' });
            return;
        }
        let cart = await Cart_js_1.Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = await Cart_js_1.Cart.create({ userId: req.user.id, items: [] });
        }
        let itemName = '';
        if (packageId) {
            const pkg = await Package_js_1.Package.findById(packageId);
            if (!pkg || pkg.isActive === false) {
                res.status(404).json({ success: false, message: 'Photoshoot package not available' });
                return;
            }
            itemName = pkg.title;
            const unitPrice = pkg.discountPrice || pkg.price;
            // Duplicate package in cart -> increment quantity instead of creating duplicate
            const existingItem = cart.items.find((it) => it.itemType === 'package' && it.packageId?.toString() === packageId.toString());
            if (existingItem) {
                existingItem.quantity += Number(quantity);
                existingItem.itemTotal = existingItem.unitPrice * existingItem.quantity;
            }
            else {
                cart.items.push({
                    itemType: 'package',
                    packageId: pkg._id,
                    studioId: studioId || pkg.studioId,
                    quantity: Number(quantity),
                    unitPrice,
                    itemTotal: unitPrice * Number(quantity)
                });
            }
        }
        else {
            const product = await Product_js_1.Product.findById(productId);
            if (!product || product.isActive === false) {
                res.status(404).json({ success: false, message: 'Product not available' });
                return;
            }
            itemName = product.title;
            let unitPrice = product.discountPrice || product.basePrice;
            // Check size price offset
            if (customization?.size && product.customizationOptions?.sizes) {
                const selectedSize = product.customizationOptions.sizes.find(s => s.name === customization.size);
                if (selectedSize && selectedSize.priceOffset) {
                    unitPrice += selectedSize.priceOffset;
                }
            }
            // If product without customization already exists, increment quantity
            const existingItem = !customization?.uploadedPhoto && !customization?.customText
                ? cart.items.find((it) => it.itemType !== 'package' && it.productId?.toString() === productId.toString())
                : null;
            if (existingItem) {
                existingItem.quantity += Number(quantity);
                existingItem.itemTotal = existingItem.unitPrice * existingItem.quantity;
            }
            else {
                cart.items.push({
                    itemType: 'product',
                    productId: product._id,
                    quantity: Number(quantity),
                    unitPrice,
                    customization,
                    itemTotal: unitPrice * Number(quantity)
                });
            }
        }
        await recalculateCart(cart);
        const populatedCart = await populateCartQuery(Cart_js_1.Cart.findById(cart._id));
        res.json({
            success: true,
            message: `${itemName} added to cart!`,
            cart: populatedCart
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.addToCart = addToCart;
const updateCartItem = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const { itemId } = req.params;
        const { quantity } = req.body;
        const cart = await Cart_js_1.Cart.findOne({ userId: req.user.id });
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
        }
        else {
            item.quantity = Number(quantity);
            item.itemTotal = item.unitPrice * item.quantity;
        }
        await recalculateCart(cart);
        const populatedCart = await populateCartQuery(Cart_js_1.Cart.findById(cart._id));
        res.json({
            success: true,
            message: 'Cart updated',
            cart: populatedCart
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateCartItem = updateCartItem;
const removeCartItem = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const { itemId } = req.params;
        const cart = await Cart_js_1.Cart.findOne({ userId: req.user.id });
        if (!cart) {
            res.status(404).json({ success: false, message: 'Cart not found' });
            return;
        }
        cart.items = cart.items.filter(i => i._id?.toString() !== itemId);
        await recalculateCart(cart);
        const populatedCart = await populateCartQuery(Cart_js_1.Cart.findById(cart._id));
        res.json({
            success: true,
            message: 'Item removed from cart',
            cart: populatedCart
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.removeCartItem = removeCartItem;
const applyCartCoupon = async (req, res) => {
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
        const coupon = await Coupon_js_1.Coupon.findOne({ code: code.toUpperCase(), isActive: true });
        if (!coupon) {
            res.status(400).json({ success: false, message: 'Invalid or expired coupon code' });
            return;
        }
        if (new Date() > new Date(coupon.validTill)) {
            res.status(400).json({ success: false, message: 'Coupon code has expired' });
            return;
        }
        const cart = await Cart_js_1.Cart.findOne({ userId: req.user.id });
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
        const populatedCart = await populateCartQuery(Cart_js_1.Cart.findById(cart._id));
        res.json({
            success: true,
            message: `Coupon '${coupon.code}' applied! Saved ₹${cart.discount}`,
            cart: populatedCart
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.applyCartCoupon = applyCartCoupon;
const clearCart = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const cart = await Cart_js_1.Cart.findOne({ userId: req.user.id });
        if (cart) {
            cart.items = [];
            cart.couponCode = undefined;
            cart.subtotal = 0;
            cart.discount = 0;
            cart.deliveryFee = 0;
            cart.total = 0;
            await cart.save();
        }
        res.json({
            success: true,
            message: 'Cart cleared successfully',
            cart
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.clearCart = clearCart;
