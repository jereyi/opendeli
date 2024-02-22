import { Router } from "express";
const router = Router();
import {
  requestPayout,
  connectInitiate,
  connectCallback,
} from "../controllers/payouts.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.post("/", verifyToken, requestPayout);

router.get("/stripe/connect/initiate", verifyToken, connectInitiate);

router.get("/stripe/connect/callback", verifyToken, connectCallback);

export default router;
