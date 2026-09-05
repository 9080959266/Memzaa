"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductBySlug = exports.getProducts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Product_js_1 = require("../models/Product.js");
const Inventory_js_1 = require("../models/Inventory.js");
const Review_js_1 = require("../models/Review.js");
const getProducts = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, featured, sort = 'popular' } = req.query;
        const filter = { isActive: { $ne: false } };
        if (category && category !== 'All') {
            filter.category = category;
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }
        if (minPrice || maxPrice) {
            filter.basePrice = {};
            if (minPrice)
                filter.basePrice.$gte = Number(minPrice);
            if (maxPrice)
                filter.basePrice.$lte = Number(maxPrice);
        }
        if (featured) {
            filter.isFeatured = true;
        }
        let sortOptions = { isFeatured: -1, rating: -1 };
        if (sort === 'price_asc')
            sortOptions = { basePrice: 1 };
        if (sort === 'price_desc')
            sortOptions = { basePrice: -1 };
        if (sort === 'rating')
            sortOptions = { rating: -1 };
        if (sort === 'newest')
            sortOptions = { createdAt: -1 };
        const products = await Product_js_1.Product.find(filter).sort(sortOptions);
        res.json({
            success: true,
            products,
            total: products.length
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProducts = getProducts;
const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const isObjectId = mongoose_1.default.Types.ObjectId.isValid(slug);
        const product = await Product_js_1.Product.findOne({
            $or: [
                { slug },
                ...(isObjectId ? [{ _id: slug }] : [])
            ],
            isActive: { $ne: false }
        });
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        const reviews = await Review_js_1.Review.find({ targetType: 'product', targetId: product._id, isApproved: true })
            .populate('userId', 'name avatar');
        const relatedProducts = await Product_js_1.Product.find({
            category: product.category,
            _id: { $ne: product._id },
            isActive: { $ne: false }
        }).limit(4);
        res.json({
            success: true,
            product,
            reviews,
            relatedProducts
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProductBySlug = getProductBySlug;
const createProduct = async (req, res) => {
    try {
        const { title, category, description, basePrice, discountPrice, stock = 50, images, thumbnail, customizationOptions, isFeatured = false, tags } = req.body;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000);
        const product = await Product_js_1.Product.create({
            title,
            slug,
            category,
            description,
            basePrice,
            discountPrice,
            stock,
            images: images || [thumbnail],
            thumbnail,
            customizationOptions: customizationOptions || {
                allowPhoto: true,
                allowText: true,
                allowDate: true,
                allowName: true,
                frameColors: ['Natural Wood', 'Matte Black', 'Classic Gold', 'Pure White'],
                sizes: [
                    { name: 'Standard (8x10 in)', priceOffset: 0 },
                    { name: 'Medium (12x18 in)', priceOffset: 450 },
                    { name: 'Large (16x24 in)', priceOffset: 950 }
                ]
            },
            isFeatured,
            tags: tags || []
        });
        // Create inventory record
        await Inventory_js_1.Inventory.create({
            productId: product._id,
            sku: `MEM-PRD-${Math.floor(10000 + Math.random() * 90000)}`,
            quantity: stock,
            lowStockThreshold: 10
        });
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product_js_1.Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        if (req.body.stock !== undefined) {
            await Inventory_js_1.Inventory.findOneAndUpdate({ productId: id }, { quantity: req.body.stock });
        }
        res.json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product_js_1.Product.findByIdAndUpdate(id, { isActive: false });
        res.json({
            success: true,
            message: 'Product removed from store'
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteProduct = deleteProduct;
