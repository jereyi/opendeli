import { Router } from 'express';
const router = Router();
import { getEarnings } from '../controllers/earnings.controller';

router.get('/', getEarnings);

export default router;
