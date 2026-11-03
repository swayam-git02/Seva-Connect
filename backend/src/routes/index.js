// Is file mein SevaConnect API v1 ke sabhi feature sub-routers combine hote hain.
// Auth, categories, providers, bookings, evidence photos, reviews aur admin endpoints yahan mount hote hain.

import { Router } from 'express';
import authRoutes from '../modules/auth/routes.js';
import categoryRoutes from '../modules/categories/routes.js';
import providerRoutes from '../modules/providers/routes.js';
import bookingRoutes from '../modules/bookings/routes.js';
import photoRoutes from '../modules/photos/routes.js';
import reviewRoutes from '../modules/reviews/routes.js';
import adminRoutes from '../modules/admin/routes.js';

const apiRouter = Router();

// Sub-routers mount point
apiRouter.use('/auth', authRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/providers', providerRoutes);
apiRouter.use('/bookings', bookingRoutes);
apiRouter.use('/bookings/:id/photos', photoRoutes);
apiRouter.use('/reviews', reviewRoutes);
apiRouter.use('/admin', adminRoutes);

// Health check endpoint - monitoring tools ya load balancers isse backend health verify karte hain
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'SevaConnect API v1',
  });
});

export default apiRouter;
