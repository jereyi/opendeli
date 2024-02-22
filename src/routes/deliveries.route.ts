import { Router } from "express";
const router = Router();
import {
  getDeliveries,
  getDelivery,
  getDeliveryItems,
  updateDeliveryStatus,
  contactCustomer,
  updateCourierNotes,
  reportIssue,
} from "../controllers/deliveries.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getDeliveries);

router.get("/:id", verifyToken, getDelivery);

router.get(":id/items", verifyToken, getDeliveryItems);

router.patch(":id/status", verifyToken, updateDeliveryStatus);

router.post("/:id/contact-customer", verifyToken, contactCustomer);

router.patch("/:id", verifyToken, updateCourierNotes);

router.post("/:id/report-issue", verifyToken, reportIssue);

export default router;
