import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Courier from "../models/courier.model";
import { LoginReqBody, PasswordResetReqBody, SignupReqBody } from "../reqBodies/auth";
import jwt from "jsonwebtoken";

export async function signup(
  req: Request<{}, {}, SignupReqBody>,
  res: Response
) {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [courier, created] = await Courier.findOrCreate({
      where: {
        email,
      },
      defaults: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phoneNumber,
      },
    });

    // Create corresponding settings object
    await courier.createSettings();

    if (created) {
      res.status(201).json({
        message: "Courier registered successfully",
      });
    } else {
      res.status(200).json({
        message: "Courier already exists",
      });
    }
  } catch (error) {
    console.error("signup: Registration failed", error);
    res.status(500).json({ error: "Registration failed" });
  }
}

export async function login(req: Request<{}, {}, LoginReqBody>, res: Response) {
  try {
    const { email, password } = req.body;
    const courier = await Courier.findOne({
      where: {
        email,
      },
    });
    if (!courier) {
      console.error("signup: Authentication failed (Courier does not exist)");
      return res
        .status(401)
        .json({ error: "Authentication failed" });
    }
    const passwordMatch = await bcrypt.compare(password, courier.password);
    if (!passwordMatch) {
      console.error("signup: Authentication failed (Password does not match)");
      return res.status(401).json({ error: "Authentication failed" });
    }
    // TODO: Set up secret key
    const token = jwt.sign(
      { courierId: courier.id },
      process.env.SECRET_KEY || "my-secret-key",
      {
        expiresIn: "24h",
      }
    );
    res.status(200).json({ token });
  } catch (error) {
    console.error("signup: Registration failed", error);
    res.status(500).json({ error: "Login failed" });
  }
}

export async function passwordReset(
  req: Request<{}, {}, PasswordResetReqBody>,
  res: Response
) {
  try {
    const { email, password, newPassword } = req.body;
    const courier = await Courier.findOne({
      where: {
        email,
      },
    });
    if (!courier) {
      console.error(
        "passwordReset: Authentication failed (Courier does not exist)"
      );
      return res.status(401).json({ error: "Authentication failed" });
    }
    const passwordMatch = await bcrypt.compare(password, courier.password);
    if (!passwordMatch) {
      console.error("signup: Authentication failed (Password does not match)");
      return res.status(401).json({ error: "Authentication failed" });
    }
   
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    Courier.update({ password: hashedPassword }, {
      where: {
        email
      }
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("signup: Registration failed", error);
    res.status(500).json({ error: "Login failed" });
  }
}
