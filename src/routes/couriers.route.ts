import { Router } from "express";
const router = Router();
import {
  getCourier,
  getCourierFullSettings,
  updateCourierFullSettings,
  updateCourierAvailability,
  updateCourierOrderSetting,
  updateCourierLocation,
  getCourierQuickAccessSettings,
} from "../controllers/couriers.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getCourier);

router.get("/full-settings", verifyToken, getCourierFullSettings);

router.patch("/full-settings", verifyToken, updateCourierFullSettings);

router.patch("/availability", verifyToken, updateCourierAvailability);

router.patch("/order-setting", verifyToken, updateCourierOrderSetting);

router.patch("/track", verifyToken, updateCourierLocation);

router.get(
  "/quick-access-settings",
  verifyToken,
  getCourierQuickAccessSettings
);

export default router;
