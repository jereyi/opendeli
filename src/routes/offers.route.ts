import { Router } from "express";
const router = Router();
import {
  getOffers,
  getOffer,
  acceptOffer,
  rejectOffer
} from "../controllers/offers.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getOffers);

router.get("/:id", verifyToken, getOffer);

router.get("/accept/:id", verifyToken, acceptOffer);

router.patch("/reject/:id", verifyToken, rejectOffer);




export default router;
