import { Router } from 'express';
const router = Router();
import { getEarnings } from '../controllers/earnings.controller';
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getEarnings);

export default router;
