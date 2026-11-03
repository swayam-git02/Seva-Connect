// Ye routes available service categories ko frontend ke search aur booking screens tak pahunchate hain.

import { Router } from 'express';
import db from '../../config/database.js';
import { sendSuccess } from '../../utils/response.js';

const router = Router();

router.get('/', (req, res) => {
  const categories = db.prepare('SELECT id, name, slug, icon, description, base_price as basePrice, active FROM service_categories WHERE active = 1').all();
  return sendSuccess(res, categories);
});

export default router;
