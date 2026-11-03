// Ye routes provider profile, public listing aur provider-owned service management ke API endpoints define karte hain.

import { Router } from 'express';
import providerService from './service.js';
import authenticate from '../../middleware/authenticate.js';
import authorize from '../../middleware/authorize.js';
import { USER_ROLES } from '../../constants/index.js';
import { sendSuccess, sendError } from '../../utils/response.js';

const router = Router();

// Public routes
router.get('/', (req, res) => {
  const result = providerService.getProviders(req.query);
  return sendSuccess(res, result);
});

router.get('/featured', (req, res) => {
  const result = providerService.getFeaturedProviders();
  return sendSuccess(res, result);
});

// Provider self-routes (must come before /:id)
router.get('/me', authenticate, authorize(USER_ROLES.PROVIDER), (req, res) => {
  const result = providerService.getProviderById(req.user.id);
  return sendSuccess(res, result);
});

router.put('/me', authenticate, authorize(USER_ROLES.PROVIDER), (req, res) => {
  try {
    const result = providerService.updateProfile(req.user.id, req.body);
    return sendSuccess(res, result, 'Profile updated successfully');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

router.get('/me/services', authenticate, authorize(USER_ROLES.PROVIDER), (req, res) => {
  const result = providerService.getServices(req.user.id);
  return sendSuccess(res, result);
});

router.post('/me/services', authenticate, authorize(USER_ROLES.PROVIDER), (req, res) => {
  try {
    const result = providerService.addService(req.user.id, req.body);
    return sendSuccess(res, result, 'Service added successfully', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

router.put('/me/services/:id', authenticate, authorize(USER_ROLES.PROVIDER), (req, res) => {
  try {
    const result = providerService.updateService(req.user.id, req.params.id, req.body);
    return sendSuccess(res, result, 'Service updated successfully');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

router.delete('/me/services/:id', authenticate, authorize(USER_ROLES.PROVIDER), (req, res) => {
  try {
    const result = providerService.deleteService(req.user.id, req.params.id);
    return sendSuccess(res, result, 'Service deleted successfully');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

router.post('/me/verification', authenticate, authorize(USER_ROLES.PROVIDER), (req, res) => {
  const result = providerService.submitVerification(req.user.id, req.body.documents);
  return sendSuccess(res, result);
});

router.get('/me/earnings', authenticate, authorize(USER_ROLES.PROVIDER), (req, res) => {
  const result = providerService.getEarnings(req.user.id);
  return sendSuccess(res, result);
});

// Public single provider route
router.get('/:id', (req, res) => {
  const provider = providerService.getProviderById(req.params.id);
  if (!provider) {
    return sendError(res, 'Provider not found', 404);
  }
  return sendSuccess(res, provider);
});

router.put('/:id', authenticate, (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== USER_ROLES.ADMIN) {
    return sendError(res, 'Unauthorized to update this profile', 403);
  }
  const result = providerService.updateProfile(req.params.id, req.body);
  return sendSuccess(res, result);
});

export default router;
