import { Router } from "express";
const router = Router();
import {
  getOffers,
  getOffer,
  dispatch,
} from "../controllers/offers.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getOffers);

router.get("/:id", verifyToken, getOffer);

router.patch("/:id", verifyToken, dispatch);

export default router;
