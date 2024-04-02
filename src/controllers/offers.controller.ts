import { Request, Response } from "express";
import Order from "../models/order.model";
import { OrderStatus } from "../utils/enum.util";
import { GetOffersReqBody } from "../reqBodies/offers";
import Courier from "../models/courier.model";
import Merchant from "../models/merchant.model";
import { Op } from "sequelize";
import Location from "../models/location.model";
import Comment from "../models/comment.model";
var db = require("../models/db"),
  sequelize = db.sequelize;

// Allow filtering by merchant and delivery time
export async function getOffers(
  req: Request<{}, {}, GetOffersReqBody>,
  res: Response
) {
  try {
    const {
      merchantIds,
      deliveryTime,
      timeOperator,
      excludedIds,
      includeMerchant,
      includeComments,
    } = req.body;

    const where: any = {
      CourierId: null,
      status: "created",
    };

    if (merchantIds && merchantIds.length > 0) {
      where.MerchantId = { [Op.in]: merchantIds };
    }

    if (excludedIds && excludedIds.length > 0) {
      where.id = {
        [Op.notIn]: excludedIds,
      };
    }

    if (deliveryTime) {
      switch (timeOperator) {
        case "between":
          where.deliveryTime = { [Op.between]: deliveryTime };
          break;
        case "before":
          where.deliveryTime = { [Op.lt]: deliveryTime[0] };
          break;
        case "after":
          where.deliveryTime = { [Op.gt]: deliveryTime[0] };
          break;
        default: // at
          where.deliveryTime = deliveryTime[0];
          break;
      }
      where.deliveryTime = deliveryTime;
    }
    const rows = await Order.findAll({
      where,
      include: [
        {
          model: Location,
          include: [
            {
              model: Comment,
            },
          ],
        },
        {
          model: Merchant,
          include: [
            {
              model: Comment,
            },
          ],
        },
      ],
    });
    console.log("Fetched offers successfully", rows);
    res.status(200).json({
      offers: rows.map((offer: Order) => ({
        ...offer.dataValues,
        pickupLocation: offer.getPickupLocation(),
        dropoffLocation: offer.getDropoffLocation(),
        returnLocation: offer.getReturnLocation(),
      })),
    });
  } catch (error) {
    console.error("getOffers:", error);
    res.status(500).json({ error: "Error fetching offers" });
  }
}

export async function getOffer(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;
    const offer = await Order.findByPk(id, {
      include: [
        {
          model: Location,
          include: [
            {
              model: Comment,
            },
          ],
        },
        {
          model: Merchant,
          include: [
            {
              model: Comment,
            },
          ],
        },
      ],
    });

    if (offer) {
      res.status(200).json({
        offer: {
          ...offer.dataValues,
          pickupLocation: offer.getPickupLocation(),
          dropoffLocation: offer.getDropoffLocation(),
          returnLocation: offer.getReturnLocation(),
        },
      });
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
    console.log("accept offer request params and body: ", req.params, req.body);
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

    console.log("reject offer request params and body: ", req.params, req.body);
    let courier = await Courier.findByPk(courierId);

    if (!courier) {
      console.log("Courier not found");
      res.status(404).json({ message: "Courier not found" });
    }

    if (courier!.rejectedOffers.findIndex((offerId) => offerId == id) != -1) {
      console.log("Offer has already been rejected");
      res.status(400).json({ message: "Offer has already been rejected" });
    }

    const [_, affectedRows] = await Courier.update(
      {
        rejectedOffers: sequelize.fn(
          "array_append",
          sequelize.col("rejectedOffers"),
          id
        ),
      },
      {
        where: { id: courierId },
        returning: true,
      }
    );

    console.log("Offer rejected successfully");
    res.status(200).json({ courier: affectedRows[0].dataValues });
  } catch (error) {
    console.error("rejectOffer:", error);
    res.status(500).json({ error: "Error fetching offer" });
  }
}
