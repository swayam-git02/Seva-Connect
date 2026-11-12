// Is file mein Cloudinary cloud image upload configuration define hai.
// Agar Cloudinary API keys available hain toh photos Cloudinary CDN par upload hoti hain.
// Agar keys missing hain ya Cloudinary API error (e.g. permission restriction) deti hai,
// toh automatically local storage fallback use hota hai taaki service workflow na ruke.

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
 * Local disk par image buffer save karta hai (Fallback handler).
 */
const saveToLocalStorage = (fileBuffer, originalName) => {
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

/**
 * Service evidence photos ko Cloudinary par upload karta hai.
 * Cloudinary credentials configured hone par images strictly Cloudinary cloud CDN par upload hoti hain.
 * Input: fileBuffer (image data), originalName (filename), folder
 * Output: { publicId, secureUrl }
 */
export const uploadImage = async (fileBuffer, originalName, folder = 'sevaconnect/evidence') => {
  // Option 1: Cloudinary upload (Strictly enforce Cloudinary upload when configured)
  if (isCloudinaryConfigured) {
    try {
      const uploadOptions = {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      };

      if (ENV.CLOUDINARY_UPLOAD_PRESET) {
        uploadOptions.upload_preset = ENV.CLOUDINARY_UPLOAD_PRESET;
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
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

      console.log(`[Cloudinary Success] Image uploaded directly to Cloudinary: ${uploadResult.secureUrl}`);
      return uploadResult;
    } catch (cloudinaryError) {
      console.error('[Cloudinary Upload Error]:', cloudinaryError);

      // Agar Cloudinary API key mein create/upload permission missing hai (HTTP 403)
      if (
        cloudinaryError.http_code === 403 ||
        String(cloudinaryError.message).includes('403') ||
        String(cloudinaryError.message).includes('forbidden') ||
        String(cloudinaryError.message).includes('create')
      ) {
        throw new Error(
          'Cloudinary Error (403): Your Cloudinary API Key lacks "create" (upload) permissions. Please check Cloudinary Console > Settings > API Keys, and generate a key with Full Access (or allow "Create" action).'
        );
      }

      throw new Error(`Cloudinary Upload Error: ${cloudinaryError.message || 'Failed to upload image to Cloudinary'}`);
    }
  }

  // Option 2: Local storage fallback sirf tabhi chalega jab Cloudinary credentials .env mein configure na hon (offline development)
  return saveToLocalStorage(fileBuffer, originalName);
};

export default { uploadImage, isCloudinaryConfigured };
