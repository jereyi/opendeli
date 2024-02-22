import { Router } from "express";
const router = Router();
import {
  getLocationComments,
  createLocationComment,
  updateLocationComment,
  upvoteLocationComment,
} from "../controllers/locations.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getLocationComments);

router.post("/", verifyToken, createLocationComment);

router.patch("/:id", verifyToken, updateLocationComment);

router.patch("/:id", verifyToken, upvoteLocationComment);

export default router;
