import { Request, Response } from "express";
import Courier from "../models/courier.model";

export async function getCouriers(req: Request, res: Response) {
  const me = await Courier.findOne()
  res.status(200).json({ courier: me });
}

export async function getCourier(req: Request, res: Response) {
}

export async function getCourierFullSettings(req: Request, res: Response) {}

export async function updateCourierFullSettings(req: Request, res: Response) {}

export async function updateCourierAvailability(req: Request, res: Response) {}

export async function updateCourierOrderSetting(req: Request, res: Response) {}

export async function updateCourierLocation(req: Request, res: Response) {}

export async function getCourierQuickAccessSettings(
  req: Request,
  res: Response
) {}
