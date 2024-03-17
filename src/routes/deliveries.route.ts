import { Router } from "express";
const router = Router();
import {
  getDeliveries,
  getDelivery,
  // updateDelivery,
  // getDeliveryItems,
  // updateDeliveryItems,
  // getDeliveryStatus,
  updateDeliveryStatus,
  contactCustomer,
  // getCourierNotes,
  updateCourierNotes,
  reportIssue,
  undispatch,
  cancelDelivery,
  markAsDelivered,
} from "../controllers/deliveries.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getDeliveries);

router.get("/:id", verifyToken, getDelivery);

// router.patch("/:id", verifyToken, updateDelivery);

// QQQ: We don't want the client to be able to change intristic order
// details like the items, customer name, merchant id, etc.

// router.get(":id/items", verifyToken, getDeliveryItems);

// router.patch(":id/items", verifyToken, updateDeliveryItems);

// router.get(":id/status", verifyToken, getDeliveryStatus);

router.patch(":id/status", verifyToken, updateDeliveryStatus);

router.patch("/:id", verifyToken, updateCourierNotes);

router.patch("/:id", verifyToken, undispatch);

router.patch("/:id", verifyToken, cancelDelivery);

router.post("/:id/contact-customer", verifyToken, contactCustomer);

// router.get("/:id", verifyToken, getCourierNotes);

router.post("/:id/report-issue", verifyToken, reportIssue);

// Add mark as delivery
router.post("/id/markAsDelivered", verifyToken, markAsDelivered)

export default router;
