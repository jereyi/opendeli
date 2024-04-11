import { Request, Response } from "express";
import { GetOffersReqBody } from "../reqBodies/offers";
import Merchant from "../models/merchant.model";
import Comment from "../models/comment.model";


export async function getMerchants(
  req: Request, res: Response
) {
  try {
    const merchants = await Merchant.findAll({ include: Comment });

    res.status(200).json({ merchants });
  } catch (error) {
    console.error("getMerchants:", error);
    res.status(500).json({ error: "Error fetching merchants" });
  }
}

export async function getMerchant(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;
    const merchant = await Merchant.findByPk(id, { include: Comment });

    if (merchant) {
      res.status(200).json({ merchant });
    } else {
      res.status(404).json({ message: "Merchant not found" });
    }
  } catch (error) {
    console.error("getMerchant:", error);
    res.status(500).json({ error: "Error fetching merchant" });
  }
}