// Is file mein multipart/form-data image uploads ke liye Multer middleware configure kiya gaya hai.
// Before-service aur After-service evidence photos ke file type, size aur count limits yahan validate hote hain.

// Ye Multer configuration service-evidence uploads ko allowed image type aur size tak limit karti hai.

import multer from 'multer';
import { sendError } from '../utils/response.js';

// Image data memory buffer mein rakha jata hai taaki Cloudinary par seedhe stream ho sake
const storage = multer.memoryStorage();

// File type filter: Sirf authentic image extensions allow karte hain (JPG, PNG, WebP)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and WebP images are allowed.'), false);
  }
};

// Multer upload instance: 5 MB per photo limit aur ek request mein maximum 5 files
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
  fileFilter,
});

// Multer errors (jaise file limit ya size exceed) ko handle karne wala middleware
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 'File too large. Maximum size is 5MB per photograph.', 400);
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return sendError(res, 'Too many files uploaded at once. Maximum 5 allowed.', 400);
    }
    return sendError(res, `Upload error: ${err.message}`, 400);
  }
  if (err) {
    return sendError(res, err.message, 400);
  }
  next();
};
