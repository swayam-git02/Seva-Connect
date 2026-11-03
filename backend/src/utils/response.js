// Is file mein API responses ko uniform format mein bhejne ke helpers hain.
// Sabhi controllers inhi functions ka use karte hain taaki frontend ko consistently formatted success ya error mile.

/**
 * Successful API response bhejta hai.
 * Format: { success: true, message: '...', data: { ... } }
 */
export const sendSuccess = (res, data = null, message = null, statusCode = 200) => {
  const payload = { success: true };
  if (message) payload.message = message;
  if (data !== null) payload.data = data;
  return res.status(statusCode).json(payload);
};

/**
 * Error API response bhejta hai.
 * Format: { success: false, message: '...', details: [ ... ] }
 */
export const sendError = (res, message = 'An error occurred', statusCode = 400, details = null) => {
  const payload = {
    success: false,
    message,
  };
  if (details) payload.details = details;
  return res.status(statusCode).json(payload);
};
