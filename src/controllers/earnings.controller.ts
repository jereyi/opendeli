import { Request, Response } from "express";
import Earning from "../models/earning.model";

// TODO: Filter by courier ID
export async function getEarnings(
  req: Request<{}, {}, { courierId: string }>,
  res: Response
) {
  try {
    const { courierId } = req.body;

    const where: any = {};

    if (courierId) {
      where.CourierId = courierId;
    }

    const earnings = await Earning.findAll({
      where,
    });

    res.status(200).json({ earnings });
  } catch (error) {
    console.error("getEarnings:", error);
    res.status(500).json({ error: "Error fetching earnings" });
  }
}

export async function getEarning(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;

    const earning = await Earning.findByPk(id);

    res.status(200).json({ earning });
  } catch (error) {
    console.error("getEarning:", error);
    res.status(500).json({ error: "Error fetching earning" });
  }
}
