import { Router } from "express";
const router = Router();
import {
  getMerchants,
  getMerchant,
    getLocations,
    getComments,
} from "../controllers/merchants.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getMerchants);

router.get("/:id", verifyToken, getMerchant);

router.get("/:id/locations", verifyToken, getLocations);

router.get("/:id/comments", verifyToken, getComments);

export default router;
