import { Router } from "express";
const router = Router();
import {
  getDeliveries,
  getDelivery,
  updateDeliveryStatus,
  updateCourierNotes,
  reportIssue,
  cancelDelivery,
  markAsDelivered,
} from "../controllers/deliveries.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.post("/", verifyToken, getDeliveries);

router.get("/:id", verifyToken, getDelivery);

router.patch("/notes/:id", verifyToken, updateCourierNotes);

router.patch("/status/:id", verifyToken, updateDeliveryStatus);

router.patch("/:id", verifyToken, cancelDelivery);

router.patch("/report-issue/:id", verifyToken, reportIssue);

router.patch("/mark-as-delivered/:id", verifyToken, markAsDelivered)

export default router;
