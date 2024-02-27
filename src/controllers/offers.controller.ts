import { Request, Response } from "express";
import Order from "../models/order.model";
import { OrderStatus } from "../utils/enum.util";
import { GetOffersReqBody } from "../reqBodies/offers";

// Allow filtering by merchant and delivery time
export async function getOffers(req: Request<{}, {}, GetOffersReqBody>, res: Response) {
  try {
    const { merchantIds, deliveryTime, timeOperator } = req.body;

    const where: any = {
      CourierId: null,
      status: "created",
    };

    if (merchantIds) {
      where.MerchantId = { in: merchantIds };
    }

    if (deliveryTime) {
      switch (timeOperator) {
        case "between":
          where.deliveryTime = { between: deliveryTime };
          break;
        case "before":
          where.deliveryTime = { lt: deliveryTime[0] };
          break;
        case "after":
          where.deliveryTime = { gt: deliveryTime[0] };
          break;
        default: // at
          where.deliveryTime = deliveryTime[0];
          break;
      }
      where.deliveryTime = deliveryTime;
    }
    const offers = await Order.findAll({
      where,
    });

    res.status(200).json({ offers });
  } catch (error) {
    console.error("getOffers:", error);
    res.status(500).json({ error: "Error fetching offers" });
  }
}

export async function getOffer(req: Request<{id: string}>, res: Response) {
  try {
    const id = req.params.id;
    const offer = await Order.findByPk(id);

    if (offer) {
      res.status(200).json({ offer });
    } else {
      res.status(404).json({ message: "Offer not found" });
    }
  } catch (error) {
    console.error("getOffer:", error);
    res.status(500).json({ error: "Error fetching offer" });
  }
}

export async function dispatch(req: Request<{ id: string }, {}, {courierId: string}>, res: Response) {
  try {
    const id = req.params.id;
    const { courierId } = req.body;
    const [affectedRows] = await Order.update(
      {
        status: OrderStatus["dispatched"],
        CourierId: courierId,
      },
      {
        where: {
          id,
        },
      }
    );

    if (affectedRows) {
      res.status(200).json({ message: "Offer dispatched successfully" });
    } else {
      res.status(404).json({ message: "Offer not found" });
    }
  } catch (error) {
    console.error("dispatch:", error);
    res.status(500).json({ error: "Error fetching offer" });
  }
}
