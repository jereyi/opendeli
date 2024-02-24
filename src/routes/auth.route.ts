import { Router } from "express";
const router = Router();
import {
  signup,
  login,
  passwordReset,
} from "../controllers/auth.controller";

router.post("/signup", signup);

router.post("/login", login);

router.post("/password-reset", passwordReset);

export default router;
