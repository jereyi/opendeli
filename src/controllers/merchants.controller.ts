import { Request, Response } from "express";
import { GetOffersReqBody } from "../reqBodies/offers";
import Merchant from "../models/merchant.model";


export async function getMerchants(
  req: Request<{}, {}, GetOffersReqBody>,
  res: Response
) {
  try {
    const merchants = await Merchant.findAll();

    res.status(200).json({ merchants });
  } catch (error) {
    console.error("getMerchants:", error);
    res.status(500).json({ error: "Error fetching merchants" });
  }
}

export async function getMerchant(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;
    const merchant = await Merchant.findByPk(id);

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

// export async function getLocations(
//   req: Request<{ id: string }>,
//   res: Response
// ) {
//   try {
//     const id = req.params.id;
//     const locations = await (await Merchant.findByPk(id))?.getLocations();

    
//     res.status(200).json({ locations });

//   } catch (error) {
//     console.error("getLocations:", error);
//     res.status(500).json({ error: "Error fetching locations" });
//   }
// }
export async function getComments(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const id = req.params.id;
    const comments = await(await Merchant.findByPk(id))?.getComments();

    res.status(200).json({ comments });
  } catch (error) {
    console.error("getComments:", error);
    res.status(500).json({ error: "Error fetching comments" });
  }
}