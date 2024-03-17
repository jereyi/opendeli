import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Courier from "../models/courier.model";
import {
  LoginReqBody,
  PasswordResetReqBody,
  SignupReqBody,
} from "../reqBodies/auth";
import jwt from "jsonwebtoken";

export async function signup(
  req: Request<{}, {}, SignupReqBody>,
  res: Response
) {
  const { firstName, lastName, email, password, phoneNumber } = req.body;
  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({
      error:
        "Courier must have a first name, last name, email address, and password",
    });
    return;
  }
  try {
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
        // imageType: profilePicture?.type,
        // imageName: profilePicture?.name,
        // imageData: await profilePicture?.arrayBuffer(),
        },
      },
    );
    if (created) {
      // Create corresponding settings object
      await courier.createSetting();
      res.status(201).json({
        message: "Courier registered successfully",
      });
    } else {
      res.status(200).json({
        message: "Courier already exists",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
}

export async function login(req: Request<{}, {}, LoginReqBody>, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      error: "Must provide email address and password to log in",
    });
    return;
  }
  try {
    const courier = await Courier.findOne({
      where: {
        email,
      },
    });
    if (!courier) {
      return res.status(401).json({ error: "Courier does not exist" });
    }
    const passwordMatch = await bcrypt.compare(password, courier.password);
    if (!passwordMatch) {
      console.log("password mismatch")
      return res.status(401).json({ error: "Password does not match" });
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
    res.status(500).json({ error: "Login failed" });
  }
}

export async function passwordReset(
  req: Request<{}, {}, PasswordResetReqBody>,
  res: Response
) {
  const { email, password, newPassword } = req.body;
  if (!email || !password || !newPassword) {
    res.status(400).json({
      error:
        "Must provide email address, old password, and new password to reset password",
    });
    return;
  }
  try {
    const courier = await Courier.findOne({
      where: {
        email,
      },
    });
    if (!courier) {
      return res.status(401).json({ error: "Courier does not exist" });
    }
    const passwordMatch = await bcrypt.compare(password, courier.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Password does not match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    Courier.update(
      { password: hashedPassword },
      {
        where: {
          email,
        },
      }
    );

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Password reset failed" });
  }
}
