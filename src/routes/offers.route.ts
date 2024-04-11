import { Router } from "express";
const router = Router();
import {
  getOffers,
  getOffer,
  acceptOffer,
  rejectOffer
} from "../controllers/offers.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.post("/", verifyToken, getOffers);

router.get("/:id", verifyToken, getOffer);

router.post("/accept/:id", verifyToken, acceptOffer);

router.post("/reject/:id", verifyToken, rejectOffer);

export default router;
