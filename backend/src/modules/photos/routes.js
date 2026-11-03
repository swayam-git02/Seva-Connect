// Ye routes booking ke before-service aur after-service evidence photos ko manage karte hain.
// Upload se pehle provider authentication aur booking ownership service layer verify karti hai.

import { Router } from 'express';
import photoService from './service.js';
import authenticate from '../../middleware/authenticate.js';
import authorize from '../../middleware/authorize.js';
import { upload, handleUploadError } from '../../middleware/upload.js';
import { USER_ROLES, PHOTO_STAGE } from '../../constants/index.js';
import { sendSuccess, sendError } from '../../utils/response.js';

const router = Router({ mergeParams: true });

// Upload Before-Service Photographs (Assigned provider only)
router.post(
  '/before',
  authenticate,
  authorize(USER_ROLES.PROVIDER),
  upload.array('photos', 5),
  handleUploadError,
  async (req, res) => {
    try {
      const photos = await photoService.uploadPhotos(
        req.params.id,
        req.user.id,
        PHOTO_STAGE.BEFORE,
        req.files,
        req.body.caption
      );
      return sendSuccess(res, photos, 'Before-service photographs uploaded successfully', 201);
    } catch (err) {
      return sendError(res, err.message, 400);
    }
  }
);

// Upload After-Service Photographs (Assigned provider only)
router.post(
  '/after',
  authenticate,
  authorize(USER_ROLES.PROVIDER),
  upload.array('photos', 5),
  handleUploadError,
  async (req, res) => {
    try {
      const photos = await photoService.uploadPhotos(
        req.params.id,
        req.user.id,
        PHOTO_STAGE.AFTER,
        req.files,
        req.body.caption
      );
      return sendSuccess(res, photos, 'After-service photographs uploaded successfully', 201);
    } catch (err) {
      return sendError(res, err.message, 400);
    }
  }
);

// Get Photographs for a Booking (Customer, Assigned Provider, or Admin)
router.get('/', authenticate, (req, res) => {
  try {
    const photos = photoService.getBookingPhotos(req.params.id, req.user.id, req.user.role);
    return sendSuccess(res, photos);
  } catch (err) {
    return sendError(res, err.message, 403);
  }
});

export default router;
