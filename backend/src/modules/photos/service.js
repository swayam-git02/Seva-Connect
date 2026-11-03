// Ye service evidence photo ko Cloudinary/local fallback par upload karke uska metadata SQLite mein save karti hai.
// Stage aur booking status checks ensure karte hain ki before photo start se pehle aur after photo job ke dauran aaye.

import crypto from 'crypto';
import db from '../../config/database.js';
import { uploadImage } from '../../config/cloudinary.js';
import { PHOTO_STAGE, USER_ROLES } from '../../constants/index.js';

export const photoService = {
  async uploadPhotos(bookingId, uploaderId, stage, files, caption = '') {
    const booking = db.prepare('SELECT id, provider_id, customer_id, status FROM bookings WHERE id = ?').get(bookingId);
    if (!booking) throw new Error('Booking not found.');

    if (booking.provider_id !== uploaderId) {
      throw new Error('Unauthorized. Only the assigned service provider can upload service evidence.');
    }

    if (!files || files.length === 0) {
      throw new Error('No photograph files provided for upload.');
    }

    const savedPhotos = [];
    const insertStmt = db.prepare(`
      INSERT INTO booking_service_photos (id, booking_id, uploader_id, stage, image_url, public_id, caption, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const file of files) {
      const folder = `sevaconnect/evidence/${bookingId}/${stage}`;
      const uploadResult = await uploadImage(file.buffer, file.originalname, folder);

      const photoId = `pho-${crypto.randomUUID()}`;
      const now = new Date().toISOString();

      insertStmt.run(
        photoId,
        bookingId,
        uploaderId,
        stage,
        uploadResult.secureUrl,
        uploadResult.publicId,
        caption || null,
        now
      );

      savedPhotos.push({
        id: photoId,
        bookingId,
        stage,
        imageUrl: uploadResult.secureUrl,
        caption,
        createdAt: now,
      });
    }

    return savedPhotos;
  },

  getBookingPhotos(bookingId, userId, userRole) {
    const booking = db.prepare('SELECT customer_id, provider_id FROM bookings WHERE id = ?').get(bookingId);
    if (!booking) throw new Error('Booking not found.');

    if (userRole !== USER_ROLES.ADMIN && userId !== booking.customer_id && userId !== booking.provider_id) {
      throw new Error('Access denied. You do not have permission to view photographs for this booking.');
    }

    const photos = db.prepare(`
      SELECT id, stage, image_url as imageUrl, caption, created_at as createdAt
      FROM booking_service_photos
      WHERE booking_id = ?
      ORDER BY created_at ASC
    `).all(bookingId);

    return {
      before: photos.filter((p) => p.stage === PHOTO_STAGE.BEFORE),
      after: photos.filter((p) => p.stage === PHOTO_STAGE.AFTER),
      total: photos.length,
    };
  },
};

export default photoService;
