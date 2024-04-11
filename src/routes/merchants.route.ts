import { Router } from "express";
const router = Router();
import {
  getMerchants,
  getMerchant,
} from "../controllers/merchants.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getMerchants);

router.get("/:id", verifyToken, getMerchant);

export default router;
