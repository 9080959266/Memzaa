"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUpdateStudio = exports.toggleStudioActive = exports.adminApproveStudio = exports.updateStudio = exports.getMyStudio = exports.compareStudios = exports.getStudioById = exports.getAllStudios = void 0;
const Studio_js_1 = require("../models/Studio.js");
const Package_js_1 = require("../models/Package.js");
const Review_js_1 = require("../models/Review.js");
const getAllStudios = async (req, res) => {
    try {
        const { city, category, minPrice, maxPrice, rating, search, priceRange, sort = 'recommended', page = 1, limit = 20 } = req.query;
        const statusParam = req.query.status;
        const query = {};
        if (statusParam && statusParam !== 'all') {
            query.verifiedStatus = statusParam;
        }
        else if (!statusParam) {
            query.verifiedStatus = 'approved';
            query.isActive = { $ne: false };
        }
        if (city && city !== 'All') {
            query.city = { $regex: new RegExp(`^${city}$`, 'i') };
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { tagline: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { 'portfolio.category': { $regex: search, $options: 'i' } }
            ];
        }
        if (rating) {
            query.rating = { $gte: Number(rating) };
        }
        if (category && category !== 'All') {
            const matchingPackages = await Package_js_1.Package.find({
                $or: [
                    { title: { $regex: category, $options: 'i' } },
                    { slug: { $regex: category, $options: 'i' } }
                ]
            }).select('studioId');
            const studioIds = matchingPackages.map((p) => p.studioId);
            const categoryMatch = {
                $or: [
                    { 'portfolio.category': { $regex: category, $options: 'i' } },
                    { _id: { $in: studioIds } }
                ]
            };
            if (query.$or) {
                query.$and = [{ $or: query.$or }, categoryMatch];
                delete query.$or;
            }
            else {
                query.$or = categoryMatch.$or;
            }
        }
        if (priceRange) {
            query.priceRange = priceRange;
        }
        if (minPrice || maxPrice) {
            query.startingPrice = {};
            if (minPrice)
                query.startingPrice.$gte = Number(minPrice);
            if (maxPrice)
                query.startingPrice.$lte = Number(maxPrice);
        }
        let sortOptions = { featured: -1, rating: -1 };
        if (sort === 'price_asc')
            sortOptions = { startingPrice: 1 };
        if (sort === 'price_desc')
            sortOptions = { startingPrice: -1 };
        if (sort === 'rating')
            sortOptions = { rating: -1 };
        if (sort === 'newest')
            sortOptions = { createdAt: -1 };
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;
        const studios = await Studio_js_1.Studio.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum)
            .populate('ownerId', 'name email phone avatar');
        const total = await Studio_js_1.Studio.countDocuments(query);
        // Get list of distinct cities for filter dropdown
        const cities = await Studio_js_1.Studio.distinct('city', { verifiedStatus: 'approved' });
        res.json({
            success: true,
            studios,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
            cities
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllStudios = getAllStudios;
const getStudioById = async (req, res) => {
    try {
        const { id } = req.params;
        const studio = await Studio_js_1.Studio.findById(id).populate('ownerId', 'name email phone avatar');
        if (!studio) {
            res.status(404).json({ success: false, message: 'Studio not found' });
            return;
        }
        const packages = await Package_js_1.Package.find({ studioId: id, isActive: { $ne: false } })
            .populate('categoryId', 'name slug icon image');
        const reviews = await Review_js_1.Review.find({ targetType: 'studio', targetId: id, isApproved: true })
            .sort({ createdAt: -1 })
            .populate('userId', 'name avatar');
        res.json({
            success: true,
            studio,
            packages,
            reviews
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getStudioById = getStudioById;
const compareStudios = async (req, res) => {
    try {
        const { ids } = req.query; // e.g. "id1,id2,id3"
        if (!ids) {
            res.status(400).json({ success: false, message: 'Please provide comma-separated studio IDs' });
            return;
        }
        const idList = ids.split(',').filter(Boolean);
        const studios = await Studio_js_1.Studio.find({ _id: { $in: idList } });
        // Fetch packages for these studios
        const packages = await Package_js_1.Package.find({ studioId: { $in: idList }, isActive: true })
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.compareStudios = compareStudios;
const getMyStudio = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        let studio = await Studio_js_1.Studio.findOne({ ownerId: req.user.id });
        if (!studio) {
            // Auto-create a default studio for shop owner if none exists
            studio = await Studio_js_1.Studio.create({
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
        const packages = await Package_js_1.Package.find({ studioId: studio._id })
            .populate('categoryId', 'name slug');
        res.json({
            success: true,
            studio,
            packages
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyStudio = getMyStudio;
const updateStudio = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const studio = await Studio_js_1.Studio.findOne({ ownerId: req.user.id });
        if (!studio) {
            res.status(404).json({ success: false, message: 'Studio profile not found' });
            return;
        }
        const { name, tagline, description, city, address, phone, email, startingPrice, priceRange, amenities, equipment, operatingHours, bannerImage, logoImage, portfolio } = req.body;
        if (name)
            studio.name = name;
        if (tagline)
            studio.tagline = tagline;
        if (description)
            studio.description = description;
        if (city)
            studio.city = city;
        if (address)
            studio.address = address;
        if (phone)
            studio.phone = phone;
        if (email)
            studio.email = email;
        if (startingPrice !== undefined)
            studio.startingPrice = startingPrice;
        if (priceRange)
            studio.priceRange = priceRange;
        if (amenities)
            studio.amenities = amenities;
        if (equipment)
            studio.equipment = equipment;
        if (operatingHours)
            studio.operatingHours = operatingHours;
        if (bannerImage)
            studio.bannerImage = bannerImage;
        if (logoImage)
            studio.logoImage = logoImage;
        if (portfolio)
            studio.portfolio = portfolio;
        await studio.save();
        res.json({
            success: true,
            message: 'Studio profile updated successfully',
            studio
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateStudio = updateStudio;
const adminApproveStudio = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body; // 'approved' | 'rejected'
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            res.status(400).json({ success: false, message: 'Invalid status' });
            return;
        }
        const studio = await Studio_js_1.Studio.findById(id);
        if (!studio) {
            res.status(404).json({ success: false, message: 'Studio not found' });
            return;
        }
        studio.verifiedStatus = status;
        if (rejectionReason)
            studio.rejectionReason = rejectionReason;
        await studio.save();
        res.json({
            success: true,
            message: `Studio has been ${status}`,
            studio
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.adminApproveStudio = adminApproveStudio;
const toggleStudioActive = async (req, res) => {
    try {
        const { id } = req.params;
        const studio = await Studio_js_1.Studio.findById(id);
        if (!studio) {
            res.status(404).json({ success: false, message: 'Studio not found' });
            return;
        }
        studio.isActive = !studio.isActive;
        await studio.save();
        res.json({
            success: true,
            message: `Studio ${studio.isActive ? 'activated' : 'deactivated'} successfully`,
            studio
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.toggleStudioActive = toggleStudioActive;
const adminUpdateStudio = async (req, res) => {
    try {
        const { id } = req.params;
        const studio = await Studio_js_1.Studio.findByIdAndUpdate(id, req.body, { new: true });
        if (!studio) {
            res.status(404).json({ success: false, message: 'Studio not found' });
            return;
        }
        res.json({
            success: true,
            message: 'Studio updated successfully by admin',
            studio
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.adminUpdateStudio = adminUpdateStudio;
