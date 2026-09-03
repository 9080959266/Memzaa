import { Request, Response } from 'express';
import { PhotoshootCategory } from '../models/PhotoshootCategory.js';
import { Package } from '../models/Package.js';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await PhotoshootCategory.find().sort({ order: 1 });
    
    // Enrich with package count
    const enriched = await Promise.all(
      categories.map(async (cat) => {
        const count = await Package.countDocuments({ categoryId: cat._id, isActive: true });
        return {
          ...cat.toObject(),
          packageCount: count
        };
      })
    );

    res.json({
      success: true,
      categories: enriched
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, slug, description, image, icon, banner, featured, order } = req.body;
    
    const category = await PhotoshootCategory.create({
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      image,
      icon: icon || 'camera',
      banner,
      featured: featured ?? true,
      order: order || 0
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await PhotoshootCategory.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
