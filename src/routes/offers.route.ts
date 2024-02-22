import { Router } from "express";
const router = Router();
import {
  getOffers,
  getOffer,
  updateOffer,
} from "../controllers/offers.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getOffers);

router.get("/:id", verifyToken, getOffer);

router.patch("/:id", verifyToken, updateOffer);

export default router;
