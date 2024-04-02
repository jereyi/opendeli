import { Router } from "express";
const router = Router();
import {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comments.controller";
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getComments);

router.get("/:id", verifyToken, getComment);

router.post("/", verifyToken, createComment);

router.patch("/:id", verifyToken, updateComment);

router.post("/delete/:id", verifyToken, deleteComment);

//router.patch("/:id/like", verifyToken, likeComment);

export default router;
