import { Router } from "express";
const router = Router();
import {
  getCouriers,
  getCourier,
  //getCourierProfile,
  updateCourierProfile,
  getCourierFullSettings,
  updateCourierFullSettings,
 // getCourierAvailability,
  updateCourierAvailability,
  //getCourierOrderSetting,
  updateCourierOrderSetting,
  //getCourierCurrentLocation,
  updateCourierCurrentLocation,
} from "../controllers/couriers.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getCouriers);
router.get("/:id", verifyToken, getCourier);

//router.get("/:id/profile", verifyToken, getCourierProfile);
router.patch("/:id/profile", verifyToken, updateCourierProfile);

router.get("/:id/full-settings", verifyToken, getCourierFullSettings);
router.patch("/:id/full-settings", verifyToken, updateCourierFullSettings);

//router.get("/:id/availability", verifyToken, getCourierAvailability);
router.patch("/:id/availability", verifyToken, updateCourierAvailability);

//router.get("/:id/order-setting", verifyToken, getCourierOrderSetting);
router.patch("/:id/order-setting", verifyToken, updateCourierOrderSetting);

//router.get("/:id/current-location", verifyToken, getCourierCurrentLocation);
router.patch(
  "/:id/current-location",
  verifyToken,
  updateCourierCurrentLocation
);

export default router;
