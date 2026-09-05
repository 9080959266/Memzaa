import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { Product } from '../models/Product.js';
import { Inventory } from '../models/Inventory.js';
import { Review } from '../models/Review.js';
import { AuthRequest } from '../middleware/auth.js';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, minPrice, maxPrice, featured, sort = 'popular' } = req.query;

    const filter: any = { isActive: { $ne: false } };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = Number(minPrice);
      if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
    }

    if (featured) {
      filter.isFeatured = true;
    }

    let sortOptions: any = { isFeatured: -1, rating: -1 };
    if (sort === 'price_asc') sortOptions = { basePrice: 1 };
    if (sort === 'price_desc') sortOptions = { basePrice: -1 };
    if (sort === 'rating') sortOptions = { rating: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };

    const products = await Product.find(filter).sort(sortOptions);

    res.json({
      success: true,
      products,
      total: products.length
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(slug);

    const product = await Product.findOne({
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

    const reviews = await Review.find({ targetType: 'product', targetId: product._id, isApproved: true })
      .populate('userId', 'name avatar');

    const relatedProducts = await Product.find({ 
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      category,
      description,
      basePrice,
      discountPrice,
      stock = 50,
      images,
      thumbnail,
      customizationOptions,
      isFeatured = false,
      tags
    } = req.body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000);

    const product = await Product.create({
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
    await Inventory.create({
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    if (req.body.stock !== undefined) {
      await Inventory.findOneAndUpdate({ productId: id }, { quantity: req.body.stock });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Product.findByIdAndUpdate(id, { isActive: false });

    res.json({
      success: true,
      message: 'Product removed from store'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
