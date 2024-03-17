import { Request, Response } from "express";
import Order from "../models/order.model";
import { OrderStatus } from "../utils/enum.util";
import { GetOffersReqBody } from "../reqBodies/offers";
import Courier from "../models/courier.model";
var db = require("../models/db"),
  sequelize = db.sequelize;

// Allow filtering by merchant and delivery time
export async function getOffers(
  req: Request<{}, {}, GetOffersReqBody>,
  res: Response
) {
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

export async function getOffer(req: Request<{ id: string }>, res: Response) {
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

export async function acceptOffer(
  req: Request<{ id: string }, {}, { courierId: string }>,
  res: Response
) {
  try {
    const id = req.params.id;
    const { courierId } = req.body;

    const courier = await Courier.findByPk(courierId);
    if (!courier) {
      res.status(404).json({ message: "Courier not found" });
      return;
    }

    const [affectedRows, order] = await Order.update(
      {
        status: OrderStatus["dispatched"],
        CourierId: courierId,
      },
      {
        where: {
          id,
          CourierId: null, // Ensures that accepted offers cannot be overwritten
        },
        returning: true,
      }
    );

    if (affectedRows) {
      courier.addAcceptedOrder(order.at(0));
      res.status(200).json({ message: "Offer accepted successfully" });
    } else {
      res.status(404).json({ message: "Offer not found" });
    }
  } catch (error) {
    console.error("acceptOffer:", error);
    res.status(500).json({ error: "Error fetching offer" });
  }
}

export async function rejectOffer(
  req: Request<{ id: string }, {}, { courierId: string }>,
  res: Response
) {
  try {
    const id = req.params.id;
    const { courierId } = req.body;

    const [affectedRows] = await Courier.update(
      {
        rejectedOffers: sequelize.fn(
          "array_append",
          sequelize.col("rejectedOffers"),
          id
        ),
      },
      {
        where: { id: courierId },
      }
    );

    if (affectedRows) {
      res.status(200).json({ message: "Offer rejected successfully" });
    } else {
      res.status(404).json({ message: "Courier not found" });
    }
  } catch (error) {
    console.error("rejectOffer:", error);
    res.status(500).json({ error: "Error fetching offer" });
  }
}
