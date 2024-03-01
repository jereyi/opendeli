import { Request, Response } from "express";
import Order from "../models/order.model";
import { OrderStatus } from "../utils/enum.util";
import {
  CourierNotesReqBody,
  GetDeliveriesReqBody,
  IssueReqBody,
} from "../reqBodies/deliveries";

// Allow filtering by merchant, courier, status, delivery time
export async function getDeliveries(
  req: Request<{}, {}, GetDeliveriesReqBody>,
  res: Response
) {
  try {
    const { merchantIds, courierIds, statuses, deliveryTime, timeOperator } =
      req.body;

    const where: any = {};

    if (merchantIds) {
      where.MerchantId = { in: merchantIds };
    }

    where.CourierId = courierIds ? { in: courierIds } : { not: null };

    where.status = statuses
      ? { in: statuses }
      : { not: OrderStatus["created"] };

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
    const deliveries = await Order.findAll({
      where,
    });

    res.status(200).json({ deliveries });
  } catch (error) {
    console.error("getDeliveries:", error);
    res.status(500).json({ error: "Error fetching deliveries" });
  }
}

export async function getDelivery(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;
    const delivery = await Order.findByPk(id);

    if (delivery) {
      res.status(200).json({ delivery });
    } else {
      res.status(404).json({ message: "Delivery not found" });
    }
  } catch (error) {
    console.error("getCourier:", error);
    res.status(500).json({ error: "Error fetching delivery" });
  }
}

// Use `undispatch` to set status to `created` and `cancelDelivery` to set status to `canceled`
export async function updateDeliveryStatus(
  req: Request<{ id: string }, {}, { status: OrderStatus }>,
  res: Response
) {
        if (
          req.body.status == OrderStatus["created"] ||
          req.body.status == OrderStatus["canceled"]
        ) {
          res.status(400).json({
            message:
              "Use `undispatch` to set status to `created` and `cancelDelivery` to set status to `canceled`",
          });
        }
  try {
    const id = req.params.id;

    const [affectedRows] = await Order.update(
      req.body,
      {
        where: {
          id,
        },
      }
    );

    if (affectedRows) {
      res.status(200).json({ message: "Delivery status updated successfully" });
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

// Convert delivery back to an offer
export async function undispatch(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;
    const [affectedRows] = await Order.update(
      {
        status: OrderStatus["created"],
        CourierId: null,
      },
      {
        where: {
          id,
        },
      }
    );

    if (affectedRows) {
      res.status(200).json({ message: "Delivery undispatched successfully" });
    } else {
      res.status(404).json({ message: "Delivery not found" });
    }
  } catch (error) {
    console.error("undispatch:", error);
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
