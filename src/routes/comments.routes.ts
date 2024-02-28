import { Router } from "express";
const router = Router();
import {
  getComments,
  getComment,
  createComment,
  updateComment,
  likeComment,
} from "../controllers/comments.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getComments);

router.get("/:id", verifyToken, getComment);

router.post("/", verifyToken, createComment);

router.patch("/:id", verifyToken, updateComment);

router.patch("/:id/like", verifyToken, likeComment);

export default router;
