import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Courier from "../models/courier.model";
import { LoginReqBody, SignupReqBody } from "../reqBodies/auth";
import jwt from "jsonwebtoken";

// TODO: Add session logic
export async function signup(
  req: Request<{}, {}, SignupReqBody>,
  res: Response
) {
  try {
    const { email, password, phoneNumber, remember_me } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await Courier.create({
      email,
      password: hashedPassword,
      phoneNumber,
    });

    res.status(201).json({ message: "Courier registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
}

export async function login(req: Request<{}, {}, LoginReqBody>, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await Courier.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    // TODO: Set up secret key
    const token = jwt.sign(
      { userId: user.id },
      process.env.SECRET_KEY || "my-secret-key",
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
}

export async function logout(req: Request, res: Response) {}

export async function passwordReset(req: Request, res: Response) {}
