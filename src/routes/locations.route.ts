import { Router } from "express";
const router = Router();
import {
  getLocations,
  getLocation,
  getComments,
} from "../controllers/locations.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getLocations);

router.get("/:id", verifyToken, getLocation);

router.post("/:id/comments", verifyToken, getComments)

export default router;
