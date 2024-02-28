import { Router } from 'express';
const router = Router();
import {
    getEarnings,
    getEarning
} from '../controllers/earnings.controller';
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getEarnings);

router.get("/:id", verifyToken, getEarning);

export default router;
