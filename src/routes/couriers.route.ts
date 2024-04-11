import { Router } from "express";
const router = Router();
import {
  getCouriers,
  getCourier,
  updateCourier,
  getCourierFullSettings,
  updateCourierFullSettings,
  getCourierOrders,
} from "../controllers/couriers.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getCouriers);

router.get("/:id", verifyToken, getCourier);
router.patch("/:id", verifyToken, updateCourier);

router.get("/full-settings/:id", verifyToken, getCourierFullSettings);
router.patch("/full-settings/:id", verifyToken, updateCourierFullSettings);

router.post("/orders/:id", verifyToken, getCourierOrders);

export default router;
