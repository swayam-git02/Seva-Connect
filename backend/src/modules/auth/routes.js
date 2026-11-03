import { Router } from 'express';
import authController from './controller.js';
import validate from '../../middleware/validate.js';
import authenticate from '../../middleware/authenticate.js';
import { authLimiter } from '../../middleware/rateLimiter.js';
import { customerSignupSchema, providerSignupSchema, loginSchema } from './validation.js';

const router = Router();

router.post('/signup', authLimiter, validate(customerSignupSchema), authController.signupCustomer);
router.post('/register/customer', authLimiter, validate(customerSignupSchema), authController.signupCustomer);
router.post('/provider-signup', authLimiter, validate(providerSignupSchema), authController.signupProvider);
router.post('/register/provider', authLimiter, validate(providerSignupSchema), authController.signupProvider);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.me);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export default router;
