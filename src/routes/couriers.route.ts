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
  updateCourierStatus,
  //getCourierOrderSetting,
  updateCourierOrderSetting,
  //getCourierCurrentLocation,
  updateCourierCurrentLocation,
} from "../controllers/couriers.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getCouriers);
router.get("/:id", verifyToken, getCourier);

//router.get("/:id/profile", verifyToken, getCourierProfile);
router.patch("/profile/:id", verifyToken, updateCourierProfile);

router.get("/full-settings/:id", verifyToken, getCourierFullSettings);
router.patch("/full-settings/:id", verifyToken, updateCourierFullSettings);

//router.get("/:id/availability", verifyToken, getCourierAvailability);
router.patch("/status/:id", verifyToken, updateCourierStatus);

//router.get("/:id/order-setting", verifyToken, getCourierOrderSetting);
router.patch("/order-setting/:id", verifyToken, updateCourierOrderSetting);

//router.get("/:id/current-location", verifyToken, getCourierCurrentLocation);
router.patch(
  "/current-location/:id",
  verifyToken,
  updateCourierCurrentLocation
);

export default router;
