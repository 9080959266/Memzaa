import { Request, Response } from 'express';
import { Package } from '../models/Package.js';
import { Studio } from '../models/Studio.js';
import { AuthRequest } from '../middleware/auth.js';

export const getPackages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studioId, categoryId, featured } = req.query;
    const filter: any = { isActive: true };

    if (studioId) filter.studioId = studioId;
    if (categoryId) filter.categoryId = categoryId;
    if (featured) filter.isPopular = true;

    const packages = await Package.find(filter)
      .populate('studioId', 'name city rating logoImage')
      .populate('categoryId', 'name slug icon image');

    res.json({
      success: true,
      packages
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPackageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pkg = await Package.findById(id)
      .populate('studioId', 'name city address rating reviewCount phone email logoImage bannerImage amenities equipment')
      .populate('categoryId', 'name slug icon image');

    if (!pkg) {
      res.status(404).json({ success: false, message: 'Package not found' });
      return;
    }

    res.json({
      success: true,
      package: pkg
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPackage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    let studioId = req.body.studioId;
    if (req.user.role === 'shop_owner') {
      const studio = await Studio.findOne({ ownerId: req.user.id });
      if (!studio) {
        res.status(400).json({ success: false, message: 'No studio associated with this account' });
        return;
      }
      studioId = studio._id;
    }

    const {
      categoryId,
      title,
      description,
      price,
      discountPrice,
      advancePercentage = 20,
      durationHours = 2,
      editedPhotosCount = 25,
      rawPhotosCount = 200,
      deliverables,
      inclusions,
      exclusions,
      isPopular = false,
      bannerImage
    } = req.body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000);

    const pkg = await Package.create({
      studioId,
      categoryId,
      title,
      slug,
      description,
      price,
      discountPrice,
      advancePercentage,
      durationHours,
      editedPhotosCount,
      rawPhotosCount,
      deliverables: deliverables || ['High-Res Digital Album', 'Online Cloud Gallery', '2 Framed Prints (8x10)'],
      inclusions: inclusions || ['Professional Lighting Setup', 'Wardrobe Changes (Up to 3)', 'Basic Skin Retouching'],
      exclusions: exclusions || ['Transportation outside city limits', 'Extended shooting hours'],
      isPopular,
      bannerImage
    });

    res.status(201).json({
      success: true,
      message: 'Photoshoot package created successfully',
      package: pkg
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePackage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pkg = await Package.findByIdAndUpdate(id, req.body, { new: true });

    if (!pkg) {
      res.status(404).json({ success: false, message: 'Package not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Package updated successfully',
      package: pkg
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePackage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Package.findByIdAndUpdate(id, { isActive: false });
    res.json({
      success: true,
      message: 'Package deactivated successfully'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
