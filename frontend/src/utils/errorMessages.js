// Centralized User-Friendly Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to SevaConnect servers. Please check your internet connection.',
  UNAUTHORIZED: 'Your session has expired. Please log in again to continue.',
  FORBIDDEN: 'You do not have permission to view or modify this resource.',
  NOT_FOUND: 'The requested service, booking, or provider could not be found.',
  INVALID_CREDENTIALS: 'The email or password entered is incorrect. Please try again.',
  INVALID_STARTING_CODE: 'Incorrect Starting Code. Please verify with the customer before starting service.',
  INVALID_ENDING_CODE: 'Incorrect Ending Code. Please request the 4-digit code from the customer upon completion.',
  SERVER_ERROR: 'Something went wrong on our end. Our team has been notified.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_PHONE: 'Please enter a valid 10-digit Indian mobile number.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long.',
  PASSWORDS_MUST_MATCH: 'Passwords do not match.',
};

export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return ERROR_MESSAGES.SERVER_ERROR;
};
