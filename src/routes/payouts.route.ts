import { Router } from "express";
const router = Router();
import {
  requestPayout,
  connectInitiate,
  connectCallback,
} from "../controllers/payouts.controller";
import { verifyToken } from "../middlewares/auth.middleware";

// USEFUL LINK: https://github.com/stripe/stripe-connect-rocketrides/blob/master/server/routes/pilots/stripe.js
router.post("/:id", verifyToken, requestPayout);

router.get("/stripe/connect/initiate", verifyToken, connectInitiate);

router.get("/stripe/connect/callback", verifyToken, connectCallback);

export default router;
