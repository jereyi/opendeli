import { Router } from "express";
const router = Router();
import {
  getLocations,
  getLocation,
} from "../controllers/locations.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getLocations);

router.get("/:id", verifyToken, getLocation);

export default router;
