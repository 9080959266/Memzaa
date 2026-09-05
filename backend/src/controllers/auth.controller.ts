import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Cart } from '../models/Cart.js';
import { Wishlist } from '../models/Wishlist.js';
import { Studio } from '../models/Studio.js';
import { Notification } from '../models/Notification.js';
import { AuthRequest } from '../middleware/auth.js';

const generateTokens = (user: any) => {
  const secret = process.env.JWT_SECRET || 'memora_super_secret_jwt_key_2025_moment_create_memories';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'memora_refresh_token_secret_998877';
  
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    secret,
    { expiresIn: '7d' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    refreshSecret,
    { expiresIn: '30d' }
  );

  return { token, refreshToken };
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role = 'customer', phone, studioName, city } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email and password.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'User already exists with this email address.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=d97706`
    });

    // If registering as a Shop Owner, create initial studio record
    let studio = null;
    if (role === 'shop_owner') {
      studio = await Studio.create({
        name: studioName || `${name}'s Photography Studio`,
        ownerId: user._id,
        tagline: 'Capturing life, one beautiful frame at a time',
        description: 'Professional photo & cinematography studio equipped with state-of-the-art gear and creative sets.',
        city: city || 'Chennai',
        address: '128, Studio Lane, Anna Nagar',
        phone: phone || '+91 98400 12345',
        email: email.toLowerCase(),
        rating: 4.9,
        reviewCount: 1,
        startingPrice: 5000,
        priceRange: '₹₹',
        verifiedStatus: 'approved',
        bannerImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
        logoImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80',
        amenities: ['Air Conditioned', 'Changing Room', 'Props Collection', 'Lighting Grid', 'Client Lounge', 'Parking'],
        equipment: ['Sony A7R V', 'Canon R5', 'Profoto B10X Strobes', 'Godox Lighting', 'Gimbal & Drone'],
        portfolio: [
          { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', title: 'Grand Wedding', category: 'Wedding', featured: true },
          { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', title: 'Candid Moments', category: 'Pre-Wedding', featured: true },
          { url: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80', title: 'Newborn Magic', category: 'Baby', featured: false }
        ]
      });
    }

    // Initialize user cart and wishlist
    await Cart.create({ userId: user._id, items: [] });
    await Wishlist.create({ userId: user._id, studios: [], products: [] });

    // Welcome notification
    await Notification.create({
      userId: user._id,
      title: 'Welcome to MEMORA! 📸',
      message: `Hi ${name}, explore top studios, book photoshoots, and create personalized memories today!`,
      type: 'system',
      link: '/'
    });

    const { token, refreshToken } = generateTokens(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        studioId: studio ? studio._id : undefined
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }
    }

    let studioId: any = undefined;
    if (user.role === 'shop_owner') {
      const studio = await Studio.findOne({ ownerId: user._id });
      if (studio) studioId = studio._id;
    }

    const { token, refreshToken } = generateTokens(user);

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        studioId
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, avatar, googleId, role = 'customer' } = req.body;

    if (!email || !name) {
      res.status(400).json({ success: false, message: 'Google authentication data missing.' });
      return;
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        googleId,
        avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        role,
        isVerified: true
      });

      await Cart.create({ userId: user._id, items: [] });
      await Wishlist.create({ userId: user._id, studios: [], products: [] });

      await Notification.create({
        userId: user._id,
        title: 'Welcome to MEMORA! 📸',
        message: `Welcome, ${name}! Start capturing and preserving your memories.`,
        type: 'system',
        link: '/'
      });
    }

    let studioId: any = undefined;
    if (user.role === 'shop_owner') {
      const studio = await Studio.findOne({ ownerId: user._id });
      if (studio) studioId = studio._id;
    }

    const { token, refreshToken } = generateTokens(user);

    res.json({
      success: true,
      message: 'Google Sign-in successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        studioId
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    let studio = null;
    if (user.role === 'shop_owner') {
      studio = await Studio.findOne({ ownerId: user._id });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        addresses: user.addresses || [],
        studioId: studio ? studio._id : undefined,
        studio: studio || undefined,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { name, phone, avatar, addresses } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar) user.avatar = avatar;
    if (addresses) user.addresses = addresses;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        addresses: user.addresses
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { label = 'Home', fullName, phone, street, city, state, pincode, isDefault = false } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (!user.addresses) user.addresses = [];

    if (isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    user.addresses.push({
      label,
      fullName,
      phone,
      street,
      city,
      state,
      pincode,
      isDefault: isDefault || user.addresses.length === 0,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      addresses: user.addresses,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { addressId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    user.addresses = (user.addresses || []).filter((a: any) => a._id?.toString() !== addressId);
    await user.save();

    res.json({
      success: true,
      message: 'Address removed successfully',
      addresses: user.addresses,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

