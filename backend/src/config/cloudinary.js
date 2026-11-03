// Is file mein Cloudinary cloud image upload configuration define hai.
// Agar Cloudinary API keys available hain toh photos Cloudinary CDN par upload hoti hain.
// Agar keys missing hain (local dev testing), toh automatically local storage fallback use hota hai.

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import ENV from './env.js';

// Check karte hain ki Cloudinary credentials set hain ya nahi
export const isCloudinaryConfigured = Boolean(
  ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY && ENV.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Service evidence photos ko Cloudinary par ya local disk fallback par upload karta hai.
 * Input: fileBuffer (image data), originalName (filename), folder
 * Output: { publicId, secureUrl }
 */
export const uploadImage = async (fileBuffer, originalName, folder = 'sevaconnect/evidence') => {
  // Option 1: Cloudinary upload (production mein optimized CDN delivery ke liye)
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            publicId: result.public_id,
            secureUrl: result.secure_url,
          });
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  // Option 2: Local fallback storage (offline / local dev environment ke liye)
  const uploadDir = path.resolve(ENV.UPLOAD_DIR);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const ext = path.extname(originalName) || '.jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
  const filePath = path.join(uploadDir, filename);

  fs.writeFileSync(filePath, fileBuffer);

  return {
    publicId: `local-${filename}`,
    secureUrl: `/uploads/${filename}`,
  };
};

export default { uploadImage, isCloudinaryConfigured };
