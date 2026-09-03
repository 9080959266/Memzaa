import { Request, Response } from 'express';
import { Studio } from '../models/Studio.js';
import { Package } from '../models/Package.js';
import { Review } from '../models/Review.js';
import { AuthRequest } from '../middleware/auth.js';

export const getAllStudios = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      city, 
      category, 
      minPrice, 
      maxPrice, 
      rating, 
      search, 
      priceRange,
      sort = 'recommended',
      page = 1, 
      limit = 20 
    } = req.query;

    const query: any = { verifiedStatus: 'approved' };

    if (city && city !== 'All') {
      query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { tagline: { $regex: search as string, $options: 'i' } },
        { city: { $regex: search as string, $options: 'i' } },
        { 'portfolio.category': { $regex: search as string, $options: 'i' } }
      ];
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (priceRange) {
      query.priceRange = priceRange;
    }

    if (minPrice || maxPrice) {
      query.startingPrice = {};
      if (minPrice) query.startingPrice.$gte = Number(minPrice);
      if (maxPrice) query.startingPrice.$lte = Number(maxPrice);
    }

    let sortOptions: any = { featured: -1, rating: -1 };
    if (sort === 'price_asc') sortOptions = { startingPrice: 1 };
    if (sort === 'price_desc') sortOptions = { startingPrice: -1 };
    if (sort === 'rating') sortOptions = { rating: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const studios = await Studio.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('ownerId', 'name email phone avatar');

    const total = await Studio.countDocuments(query);

    // Get list of distinct cities for filter dropdown
    const cities = await Studio.distinct('city', { verifiedStatus: 'approved' });

    res.json({
      success: true,
      studios,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      cities
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudioById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const studio = await Studio.findById(id).populate('ownerId', 'name email phone avatar');
    if (!studio) {
      res.status(404).json({ success: false, message: 'Studio not found' });
      return;
    }

    const packages = await Package.find({ studioId: id, isActive: true })
      .populate('categoryId', 'name slug icon image');

    const reviews = await Review.find({ targetType: 'studio', targetId: id, isApproved: true })
      .sort({ createdAt: -1 })
      .populate('userId', 'name avatar');

    res.json({
      success: true,
      studio,
      packages,
      reviews
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const compareStudios = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.query; // e.g. "id1,id2,id3"
    if (!ids) {
      res.status(400).json({ success: false, message: 'Please provide comma-separated studio IDs' });
      return;
    }

    const idList = (ids as string).split(',').filter(Boolean);
    const studios = await Studio.find({ _id: { $in: idList } });
    
    // Fetch packages for these studios
    const packages = await Package.find({ studioId: { $in: idList }, isActive: true })
      .populate('categoryId', 'name slug');

    const comparisonData = studios.map(studio => {
      const studioPackages = packages.filter(p => p.studioId.toString() === studio._id.toString());
      return {
        studio,
        packages: studioPackages,
        packageCount: studioPackages.length,
        minPackagePrice: studioPackages.length > 0 ? Math.min(...studioPackages.map(p => p.price)) : studio.startingPrice,
        amenities: studio.amenities,
        equipment: studio.equipment,
        rating: studio.rating,
        reviewCount: studio.reviewCount,
        operatingHours: studio.operatingHours
      };
    });

    res.json({
      success: true,
      comparison: comparisonData
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyStudio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    let studio = await Studio.findOne({ ownerId: req.user.id });
    if (!studio) {
      // Auto-create a default studio for shop owner if none exists
      studio = await Studio.create({
        name: `${req.user.name}'s Studio`,
        ownerId: req.user.id,
        tagline: 'Professional Photography & Cinematic Memories',
        description: 'We specialize in artistic portraits, weddings, and personalized photo moments.',
        city: 'Chennai',
        address: '100 Feet Road, Vadapalani',
        phone: '+91 98400 98765',
        email: req.user.email,
        rating: 4.8,
        reviewCount: 0,
        startingPrice: 6000,
        priceRange: '₹₹',
        verifiedStatus: 'approved',
        bannerImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
        logoImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80',
        amenities: ['Air Conditioned', 'Dressing Room', 'Backdrop Setup', 'LED Lights', 'Client Parking'],
        equipment: ['Sony Alpha A7 IV', 'Canon EOS R6 Mark II', 'DJI Ronin RS3', 'Elinchrom Strobes']
      });
    }

    const packages = await Package.find({ studioId: studio._id })
      .populate('categoryId', 'name slug');

    res.json({
      success: true,
      studio,
      packages
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const studio = await Studio.findOne({ ownerId: req.user.id });
    if (!studio) {
      res.status(404).json({ success: false, message: 'Studio profile not found' });
      return;
    }

    const {
      name,
      tagline,
      description,
      city,
      address,
      phone,
      email,
      startingPrice,
      priceRange,
      amenities,
      equipment,
      operatingHours,
      bannerImage,
      logoImage,
      portfolio
    } = req.body;

    if (name) studio.name = name;
    if (tagline) studio.tagline = tagline;
    if (description) studio.description = description;
    if (city) studio.city = city;
    if (address) studio.address = address;
    if (phone) studio.phone = phone;
    if (email) studio.email = email;
    if (startingPrice !== undefined) studio.startingPrice = startingPrice;
    if (priceRange) studio.priceRange = priceRange;
    if (amenities) studio.amenities = amenities;
    if (equipment) studio.equipment = equipment;
    if (operatingHours) studio.operatingHours = operatingHours;
    if (bannerImage) studio.bannerImage = bannerImage;
    if (logoImage) studio.logoImage = logoImage;
    if (portfolio) studio.portfolio = portfolio;

    await studio.save();

    res.json({
      success: true,
      message: 'Studio profile updated successfully',
      studio
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminApproveStudio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body; // 'approved' | 'rejected'

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }

    const studio = await Studio.findById(id);
    if (!studio) {
      res.status(404).json({ success: false, message: 'Studio not found' });
      return;
    }

    studio.verifiedStatus = status;
    if (rejectionReason) studio.rejectionReason = rejectionReason;
    await studio.save();

    res.json({
      success: true,
      message: `Studio has been ${status}`,
      studio
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
