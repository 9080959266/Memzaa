import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Photo } from '../models/Photo.js';
import { Studio } from '../models/Studio.js';
import { PhotoJob } from '../models/PhotoJob.js';
import { Booking } from '../models/Booking.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

export const getMyPhotos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { category, isFavourite, photoJobId, bookingId } = req.query;
    let query: any = {};

    if (req.user.role === 'customer') {
      query.user = req.user.id;
    } else if (req.user.role === 'shop_owner') {
      const studio = await Studio.findOne({ ownerId: req.user.id });
      if (studio) {
        query = {
          $or: [
            { user: req.user.id },
            { studioId: studio._id },
          ],
        };
      } else {
        query.user = req.user.id;
      }
    }

    if (category) query.category = category;
    if (isFavourite === 'true') query.isFavourite = true;
    if (photoJobId) query.photoJobId = photoJobId;
    if (bookingId) query.bookingId = bookingId;

    const photos = await Photo.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: photos.length,
      photos,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addPhoto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { url, name, size, mimeType, dimensions, category = 'uploaded', orderId, bookingId, photoJobId, publicId } = req.body;

    if (!url || !name) {
      res.status(400).json({ success: false, message: 'Photo URL and name are required.' });
      return;
    }

    let studioId = undefined;
    if (req.user.role === 'shop_owner') {
      const studio = await Studio.findOne({ ownerId: req.user.id });
      if (studio) studioId = studio._id;
    } else if (photoJobId) {
      const job = await PhotoJob.findById(photoJobId);
      if (job) {
        studioId = job.studioId;
        job.photos.push({
          url,
          originalName: name,
          sizeBytes: size,
          status: 'uploaded',
          uploadedAt: new Date()
        });
        if (job.stage === 'NEW_ORDER') {
          job.stage = 'PHOTOS_UPLOADED';
        }
        await job.save();
      }
    } else if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (booking) {
        studioId = booking.studioId;
        const job = await PhotoJob.findOne({ bookingId: booking._id });
        if (job) {
          job.photos.push({
            url,
            originalName: name,
            sizeBytes: size,
            status: 'uploaded',
            uploadedAt: new Date()
          });
          if (job.stage === 'NEW_ORDER') {
            job.stage = 'PHOTOS_UPLOADED';
          }
          await job.save();
        }
      }
    }

    const photo = await Photo.create({
      user: req.user.id,
      studioId,
      url,
      thumbnailUrl: url,
      publicId: publicId || `pub_${Date.now()}`,
      name,
      size,
      mimeType,
      dimensions,
      category,
      orderId,
      bookingId,
      photoJobId,
    });

    res.status(201).json({
      success: true,
      message: 'Photo saved to personal cloud vault',
      photo,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleFavouritePhoto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { id } = req.params;
    const photo = await Photo.findOne({ _id: id, user: req.user.id });

    if (!photo) {
      res.status(404).json({ success: false, message: 'Photo not found.' });
      return;
    }

    photo.isFavourite = !photo.isFavourite;
    await photo.save();

    res.json({
      success: true,
      message: photo.isFavourite ? 'Marked as favourite' : 'Removed from favourites',
      photo,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadPhoto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const photo = await Photo.findById(id);

    if (!photo) {
      res.status(404).json({ success: false, message: 'Photo not found.' });
      return;
    }

    photo.downloadCount = (photo.downloadCount || 0) + 1;
    await photo.save();

    res.json({
      success: true,
      message: 'High-res download link generated',
      downloadUrl: photo.url,
      fileName: photo.name,
      size: photo.size,
      downloadCount: photo.downloadCount,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePhoto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { id } = req.params;
    let query: any = { _id: id };

    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const photo = await Photo.findOne(query);

    if (!photo) {
      res.status(404).json({ success: false, message: 'Photo not found or access denied.' });
      return;
    }

    if (photo.publicId) {
      await deleteFromCloudinary(photo.publicId);
    }

    await Photo.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Photo removed from storage and database.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
