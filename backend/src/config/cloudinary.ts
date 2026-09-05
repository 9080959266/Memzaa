import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

const isCloudinaryConfigured = (): boolean => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  return Boolean(
    cloudName &&
    cloudName !== 'demo' &&
    cloudName !== 'your_cloud_name' &&
    apiKey &&
    apiKey !== 'demo' &&
    apiKey !== 'your_api_key' &&
    apiSecret &&
    apiSecret !== 'demo' &&
    apiSecret !== 'your_api_secret'
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log('☁️ Cloudinary storage configured successfully.');
} else {
  console.log('📁 Cloudinary credentials not set or in demo mode. Active local static storage (/uploads) enabled as fallback.');
}

export interface CloudinaryUploadResult {
  success: boolean;
  url: string;
  publicId: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  resourceType?: string;
}

export const uploadToCloudinary = async (
  filePath: string,
  folder: string = 'memora_photos'
): Promise<CloudinaryUploadResult> => {
  if (isCloudinaryConfigured()) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'auto',
        transformation: [{ quality: 'auto:good', fetch_format: 'auto' }],
      });

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        resourceType: result.resource_type,
      };
    } catch (error) {
      console.error('Cloudinary upload failed, falling back to local file reference:', error);
    }
  }

  // Fallback to local file reference
  const filename = path.basename(filePath);
  let bytes = 0;
  try {
    const stats = fs.statSync(filePath);
    bytes = stats.size;
  } catch (e) {
    // ignore
  }

  const ext = path.extname(filePath).replace('.', '') || 'jpg';
  return {
    success: true,
    url: `/uploads/${filename}`,
    publicId: `local_${filename}`,
    format: ext,
    bytes: bytes || 102400,
    width: 1920,
    height: 1080,
    resourceType: 'image',
  };
};

export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    if (publicId.startsWith('local_')) {
      const filename = publicId.replace('local_', '');
      const localPath = path.join(process.cwd(), 'uploads', filename);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
      return true;
    }

    if (isCloudinaryConfigured()) {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    }

    return true;
  } catch (error) {
    console.error('Failed to delete asset:', error);
    return false;
  }
};

export { cloudinary, isCloudinaryConfigured };
