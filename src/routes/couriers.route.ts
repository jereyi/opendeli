import { Router } from "express";
const router = Router();
import {
  getCouriers,
  getCourier,
  updateCourier,
  getCourierFullSettings,
  updateCourierFullSettings,
} from "../controllers/couriers.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getCouriers);

router.get("/:id", verifyToken, getCourier);
router.patch("/:id", verifyToken, updateCourier);

router.get("/full-settings/:id", verifyToken, getCourierFullSettings);
router.patch("/full-settings/:id", verifyToken, updateCourierFullSettings);

export default router;
