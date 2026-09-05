import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { Photo } from '../models/Photo.js';

export const handleSingleUpload = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const folder = req.body.category === 'proof' ? 'memora_proofs' : 'memora_photos';
    const uploadResult = await uploadToCloudinary(req.file.path, folder);

    let photoDoc = null;
    if (req.user) {
      photoDoc = await Photo.create({
        user: req.user.id,
        name: req.file.originalname,
        url: uploadResult.url,
        thumbnailUrl: uploadResult.url,
        publicId: uploadResult.publicId,
        size: uploadResult.bytes || req.file.size,
        mimeType: req.file.mimetype,
        dimensions: {
          width: uploadResult.width || 1920,
          height: uploadResult.height || 1080,
        },
        category: req.body.category || 'uploaded',
        orderId: req.body.orderId || undefined,
        bookingId: req.body.bookingId || undefined,
        photoJobId: req.body.photoJobId || undefined,
      });
    }

    res.json({
      success: true,
      message: 'File uploaded successfully to cloud storage',
      file: {
        id: photoDoc?._id,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: uploadResult.bytes || req.file.size,
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleMultipleUpload = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ success: false, message: 'No files uploaded' });
      return;
    }

    const folder = req.body.category === 'proof' ? 'memora_proofs' : 'memora_photos';
    const uploadPromises = (req.files as Express.Multer.File[]).map(async (f) => {
      const uploadResult = await uploadToCloudinary(f.path, folder);

      let photoDoc = null;
      if (req.user) {
        photoDoc = await Photo.create({
          user: req.user.id,
          name: f.originalname,
          url: uploadResult.url,
          thumbnailUrl: uploadResult.url,
          publicId: uploadResult.publicId,
          size: uploadResult.bytes || f.size,
          mimeType: f.mimetype,
          dimensions: {
            width: uploadResult.width || 1920,
            height: uploadResult.height || 1080,
          },
          category: req.body.category || 'uploaded',
          orderId: req.body.orderId || undefined,
          bookingId: req.body.bookingId || undefined,
          photoJobId: req.body.photoJobId || undefined,
        });
      }

      return {
        id: photoDoc?._id,
        filename: f.filename,
        originalName: f.originalname,
        mimetype: f.mimetype,
        size: uploadResult.bytes || f.size,
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: `${uploadedFiles.length} files uploaded successfully to cloud storage`,
      files: uploadedFiles,
      urls: uploadedFiles.map((f) => f.url),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleCustomizerUpload = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const photoFile = files?.['photo']?.[0];
    const mockupFile = files?.['mockup']?.[0];

    let photoUrl: string | undefined;
    let mockupUrl: string | undefined;

    if (photoFile) {
      const resPhoto = await uploadToCloudinary(photoFile.path, 'memora_customizer');
      photoUrl = resPhoto.url;
      if (req.user) {
        await Photo.create({
          user: req.user.id,
          name: photoFile.originalname,
          url: photoUrl,
          thumbnailUrl: photoUrl,
          publicId: resPhoto.publicId,
          size: resPhoto.bytes || photoFile.size,
          mimeType: photoFile.mimetype,
          category: 'used_in_order',
        });
      }
    }

    if (mockupFile) {
      const resMockup = await uploadToCloudinary(mockupFile.path, 'memora_mockups');
      mockupUrl = resMockup.url;
    }

    res.json({
      success: true,
      message: 'Customization assets processed successfully',
      photoUrl,
      mockupUrl,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
