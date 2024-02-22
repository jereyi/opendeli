import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY || "your-secret-key"
    );
    res.cookie("userId", (decoded as JwtPayload).userId);
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

