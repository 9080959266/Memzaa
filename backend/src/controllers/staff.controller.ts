import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Staff } from '../models/Staff.js';
import { Studio } from '../models/Studio.js';

export const getStudioStaff = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studio = await Studio.findOne({ ownerId: req.user?.id });
    if (!studio) {
      res.status(404).json({ success: false, message: 'Studio not found' });
      return;
    }

    const staffMembers = await Staff.find({ studioId: studio._id, isActive: true }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: staffMembers.length,
      staff: staffMembers,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addStaffMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studio = await Studio.findOne({ ownerId: req.user?.id });
    if (!studio) {
      res.status(404).json({ success: false, message: 'Studio not found' });
      return;
    }

    const { name, email, phone, role, specialties, avatar } = req.body;

    if (!name || !email || !phone) {
      res.status(400).json({ success: false, message: 'Name, email, and phone are required' });
      return;
    }

    const staff = await Staff.create({
      studioId: studio._id,
      name,
      email,
      phone,
      role: role || 'lead_photographer',
      specialties: specialties || ['Wedding', 'Candid'],
      avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    });

    res.status(201).json({
      success: true,
      message: 'Staff member added successfully',
      staff,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStaffMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const staff = await Staff.findByIdAndUpdate(id, req.body, { new: true });

    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff member not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Staff member updated successfully',
      staff,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStaffMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Staff.findByIdAndUpdate(id, { isActive: false });

    res.json({
      success: true,
      message: 'Staff member removed',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
