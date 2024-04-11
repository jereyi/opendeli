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

router.delete("/:id", verifyToken, deleteComment);

export default router;
