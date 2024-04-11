import { Request, Response } from "express";
import Order from "../models/order.model";
import { OrderStatus } from "../utils/enum.util";
import {
  CourierNotesReqBody,
  GetDeliveriesReqBody,
  IssueReqBody,
  MarkAsDeliveredReqBody,
} from "../reqBodies/deliveries";
import { Op } from "sequelize";
import Merchant from "../models/merchant.model";
import Location from "../models/location.model";
import Comment from "../models/comment.model";

export async function getDeliveries(
  req: Request<{}, {}, GetDeliveriesReqBody>,
  res: Response
) {
  try {
    const {
      merchantIds,
      courierIds,
      statuses,
      deliveryTime,
      timeOperator,
    } = req.body;

    const where: any = {};

    if (merchantIds) {
      where.MerchantId = { [Op.in]: merchantIds };
    }

    where.CourierId = courierIds ? { [Op.in]: courierIds } : { [Op.not]: null };

    where.status = statuses
      ? { [Op.in]: statuses }
      : { [Op.not]: OrderStatus["created"] };

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
    }
    const deliveries = await Order.findAll({
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
    console.log("Fetched deliveries successfully", deliveries);
    res.status(200).json({
      deliveries: deliveries.map((delivery) => ({
        ...delivery.dataValues,
        pickupLocation: delivery.getPickupLocation(),
        dropoffLocation: delivery.getDropoffLocation(),
        returnLocation: delivery.getReturnLocation(),
      })),
    });
  } catch (error) {
    console.error("getDeliveries:", error);
    res.status(500).json({ error: "Error fetching deliveries" });
  }
}

export async function getDelivery(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;
    const delivery = await Order.findByPk(id, {
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

    if (delivery && delivery.status != "created") {
      res.status(200).json({
        delivery: {
          ...delivery.dataValues,
          pickupLocation: delivery.getPickupLocation(),
          dropoffLocation: delivery.getDropoffLocation(),
          returnLocation: delivery.getReturnLocation(),
        },
      });
    } else {
      res.status(404).json({ message: "Delivery not found" });
    }
  } catch (error) {
    console.error("getCourier:", error);
    res.status(500).json({ error: "Error fetching delivery" });
  }
}

// NOTE: To convert a delivery back to an order, set its status to `created`
export async function updateDeliveryStatus(
  req: Request<{ id: string }, {}, { status: OrderStatus }>,
  res: Response
) {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (status == OrderStatus.dropped_off) {
      res.status(400).json({ message: "Use mark as delivered to change status to delivered"
      });
      return;
    } 

    const [affectedCount] = await Order.update(
      { status },
      {
        where: {
          id,
        },
      }
    );

    if (affectedCount) {
      const delivery = await Order.findByPk(id, {
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
      console.log("Delivery status updated successfully");
      res.status(200).json({
        delivery: {
          ...delivery!.dataValues,
          pickupLocation: delivery!.getPickupLocation(),
          dropoffLocation: delivery!.getDropoffLocation(),
          returnLocation: delivery!.getReturnLocation(),
        },
      });
    } else {
      res.status(404).json({ message: "Delivery not found" });
    }
  } catch (error) {
    console.error("updateDeliveryStatus:", error);
    res.status(500).json({ error: "Error fetching delivery" });
  }
}

export async function updateCourierNotes(
  req: Request<{ id: string }, {}, CourierNotesReqBody>,
  res: Response
) {
  try {
    const id = req.params.id;
    const { courierNotes, shouldAppend } = req.body;

    let notes: string[];
    if (shouldAppend) {
      notes = (await Order.findByPk(id, {
        attributes: ["courierNotes"],
      }))!.courierNotes;
      notes.concat(courierNotes!);
    } else {
      notes = courierNotes!;
    }
    const [affectedRows] = await Order.update(
      { courierNotes: notes },
      {
        where: {
          id,
        },
      }
    );

    if (affectedRows) {
      res.status(200).json({ message: "Courier notes updated successfully" });
    } else {
      res.status(404).json({ message: "Delivery not found" });
    }
  } catch (error) {
    console.error("updateCourierNotes:", error);
    res.status(500).json({ error: "Error fetching delivery" });
  }
}

export async function reportIssue(
  req: Request<{ id: string }, {}, IssueReqBody>,
  res: Response
) {
  try {
    const id = req.params.id;
    const { undeliverableAction, undeliverableReason } = req.body;

    const [affectedRows] = await Order.update(
      { undeliverableAction, undeliverableReason },
      {
        where: {
          id,
        },
      }
    );

    if (affectedRows) {
      res.status(200).json({ message: "Marked as undeliverable successfully" });
    } else {
      res.status(404).json({ message: "Delivery not found" });
    }
  } catch (error) {
    console.error("markAsUndeliverable:", error);
    res.status(500).json({ error: "Error fetching delivery" });
  }
}

export async function cancelDelivery(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const id = req.params.id;
    const [affectedRows] = await Order.update(
      {
        status: OrderStatus["canceled"],
        CourierId: null,
      },
      {
        where: {
          id,
        },
      }
    );

    if (affectedRows) {
      res.status(200).json({ message: "Delivery canceled successfully" });
    } else {
      res.status(404).json({ message: "Delivery not found" });
    }
  } catch (error) {
    console.error("cancelDelivery:", error);
    res.status(500).json({ error: "Error fetching delivery" });
  }
}

// TODO: Implement matrix integration
export async function contactCustomer(req: Request, res: Response) {}

export async function markAsDelivered(
  req: Request<{ id: string }, {}, MarkAsDeliveredReqBody>,
  res: Response
) {
  try {
    const id = req.params.id;
    const { notes, photo } = req.body;
    console.log("photo", photo)
    const [affectedCount] = await Order.update(
      {
        courierNotes: notes,
        imageData: photo?.data,
        imageName: photo?.name,
        imageType: photo?.type,
        status: OrderStatus.dropped_off,
      },
      {
        where: {
          id,
        },
      }
    ); 

    if (affectedCount) {
      const delivery = await Order.findByPk(id, {
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
      console.log("Delivery marked as completed successfully");
      res.status(200).json({
        delivery: {
          ...delivery!.dataValues,
          pickupLocation: delivery!.getPickupLocation(),
          dropoffLocation: delivery!.getDropoffLocation(),
          returnLocation: delivery!.getReturnLocation(),
        },
      });
    } else {
      res.status(404).json({ message: "Delivery not found" });
    }
  } catch (error) {
    console.error("markAsDelivered:", error);
    res.status(500).json({ error: "Error fetching delivery" });
  }
}
