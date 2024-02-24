import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    console.error("verifyToken: Access denied")
    res.clearCookie("courierId");
    return res.status(401).json({ error: "Access denied" });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY || "my-secret-key"
    );
    res.cookie("courierId", (decoded as JwtPayload).courierId);
    next();
  } catch (error) {
    console.error("verifyToken: Invalid token", error);
    res.clearCookie("courierId");
    res.status(401).json({ error: "Invalid token" });
  }
}

