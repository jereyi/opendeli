import { Request, Response } from "express";
import Courier from "../models/courier.model";
import {
  CouriersReqBody,
  ProfileReqBody,
  SettingsReqBody,
} from "../reqBodies/courier";
import Settings from "../models/settings.model";
import { OrderSetting } from "../utils/enum.util";
import { Point } from "../utils/types.util";

// TODO: Add filtering by location and shift
export async function getCouriers(
  req: Request<{}, {}, CouriersReqBody>,
  res: Response
) {
  try {
    const { isAvailable, shiftAt, location } = req.body;
    const filters: any = {};

    if (isAvailable != undefined) filters.isAvailable = isAvailable;

    const couriers = await Courier.findAll({
      where: filters,
      include: Settings,
    });

    res.status(200).json({ couriers });
  } catch (error) {
    console.error("getCouriers:", error);
    res.status(500).json({ error: "Error fetching couriers" });
  }
}

export async function getCourier(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;
    const courier = await Courier.findByPk(id, { include: Settings });

    if (courier) {
      res.status(200).json({ courier });
    } else {
      res.status(404).json({ message: "Courier not found" });
    }
  } catch (error) {
    console.error("getCourier:", error);
    res.status(500).json({ error: "Error fetching courier" });
  }
}

export async function getCourierProfile(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const courier = await Courier.findByPk(id, {
      attributes: ["firstName", "lastName", "email", "phoneNumber"],
    });

    if (courier) {
      res.status(200).json({
        profile: {
          firstName: courier.firstName,
          lastName: courier.lastName,
          email: courier.email,
          phoneNumber: courier.phoneNumber,
        },
      });
    } else {
      res.status(404).json({ message: "Courier not found" });
    }
  } catch (error) {
    console.error("getCourierProfile:", error);
    res.status(500).json({ error: "Error fetching courier" });
  }
}

export async function updateCourierProfile(
  req: Request<{ id: string }, {}, ProfileReqBody>,
  res: Response
) {
  try {
    const id = req.params.id;
    const { firstName, lastName, email, phoneNumber } = req.body;

    const updates: any = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) updates.email = email;
    if (phoneNumber) updates.phoneNumber;

    const [affectedRows] = await Courier.update(updates, {
      where: {
        id,
      },
    });

    if (affectedRows > 0) {
      res.status(200).json({ message: "Profile updated successfully" });
    } else {
      res.status(404).json({ message: "Courier not found" });
    }
  } catch (error) {
    console.error("getCourierProfile:", error);
    res.status(500).json({ error: "Error updating profile" });
  }
}

export async function getCourierFullSettings(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const courier = await Courier.findByPk(id, { include: Settings });

    if (courier) {
      res.status(200).json({ settings: courier.settings });
    } else {
      res.status(404).json({ message: "Courier not found" });
    }
  } catch (error) {
    console.error("getCourierFullSettings:", error);
    res.status(500).json({ error: "Error fetching courier settings" });
  }
}

export async function updateCourierFullSettings(
  req: Request<{ id: string }, {}, SettingsReqBody>,
  res: Response
) {
  try {
    const id = req.params.id;
    const {
      deliveryPolygon,
      vehicleType,
      preferredAreas,
      shiftAvailability,
      orderPreferences,
      foodPreferences,
      earningGoals,
      deliverySpeed,
      restaurantTypes,
      cuisineType,
      preferredRestaurantPartners,
      dietaryRestrictions,
      payRate,
    } = req.body;
    const courier = await Courier.findByPk(id);
    const settings: any = {};
    if (courier) {
      // NOTE: You may have to manipulate these object to make them fit in DB
      if (deliveryPolygon) settings.deliveryPolygon = deliveryPolygon;
      if (vehicleType) settings.vehicleType = vehicleType;
      if (preferredAreas) settings.preferredAreas = preferredAreas;
      if (shiftAvailability) settings.shiftAvailability = shiftAvailability;
      if (orderPreferences) settings.orderPreferences = orderPreferences;
      if (foodPreferences) settings.foodPreferences = foodPreferences;
      if (earningGoals) settings.earningGoals = earningGoals;
      if (deliverySpeed) settings.deliverySpeed = deliverySpeed;
      if (restaurantTypes) settings.restaurantTypes = restaurantTypes;
      if (cuisineType) settings.cuisineType = cuisineType;
      if (preferredRestaurantPartners)
        settings.preferredRestaurantPartners = preferredRestaurantPartners;
      if (dietaryRestrictions)
        settings.dietaryRestrictions = dietaryRestrictions;
      if (payRate) settings.payRate = payRate;

      await Settings.update(settings, {
        where: {
          courierId: id,
        },
      });
      res
        .status(200)
        .json({ message: "Courier settings updated successfully" });
    } else {
      res.status(404).json({ message: "Courier not found" });
    }
  } catch (error) {
    console.error("updateCourierFullSettings:", error);
    res.status(500).json({ error: "Error fetching courier settings" });
  }
}

export async function getCourierAvailability(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const id = req.params.id;
    const courier = await Courier.findByPk(id, {
      attributes: ["isAvailable"],
    });

    if (courier) {
      res.status(200).json({ isAvailable: courier.isAvailable });
    } else {
      res.status(404).json({ message: "Courier not found" });
    }
  } catch (error) {
    console.error("getCourierAvailability:", error);
    res.status(500).json({ error: "Error fetching courier availability" });
  }
}

export async function updateCourierAvailability(
  req: Request<{ id: string }, {}, { isAvailable: boolean }>,
  res: Response
) {
  try {
    const id = req.params.id;
    const { isAvailable } = req.body;

    const [affectedRows] = await Courier.update(
      { isAvailable },
      {
        where: {
          id,
        },
      }
    );

    if (affectedRows > 0) {
      res.status(200).json({ message: "Availability updated successfully" });
    } else {
      res.status(404).json({ message: "Courier not found" });
    }
  } catch (error) {
    console.error("updateCourierAvailability:", error);
    res.status(500).json({ error: "Error updating availability" });
  }
}

export async function getCourierOrderSetting(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const id = req.params.id;
    const courier = await Courier.findByPk(id, {
      attributes: ["orderSetting"],
    });

    if (courier) {
      res.status(200).json({ orderSetting: courier.orderSetting });
    } else {
      res.status(404).json({ message: "Courier not found" });
    }
  } catch (error) {
    console.error("getCourierOrderSetting:", error);
    res.status(500).json({ error: "Error fetching courier order setting" });
  }
}

export async function updateCourierOrderSetting(
  req: Request<{ id: string }, {}, { orderSetting: OrderSetting }>,
  res: Response
) {
  try {
    const id = req.params.id;
    const { orderSetting } = req.body;

    const [affectedRows] = await Courier.update(
      { orderSetting },
      {
        where: {
          id,
        },
      }
    );

    if (affectedRows > 0) {
      res.status(200).json({ message: "Order settings updated successfully" });
    } else {
      res.status(404).json({ message: "Courier not found" });
    }
  } catch (error) {
    console.error("updateCourierOrderSetting:", error);
    res.status(500).json({ error: "Error updating order setting" });
  }
}

export async function getCourierCurrentLocation(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const id = req.params.id;
    const courier = await Courier.findByPk(id, {
      attributes: ["currentLocation"],
    });

    if (courier) {
      res.status(200).json({ currentLocation: courier.currentLocation });
    } else {
      res.status(404).json({ message: "Courier not found" });
    }
  } catch (error) {
    console.error("getCourierCurrentLocation:", error);
    res.status(500).json({ error: "Error fetching courier location" });
  }
}

export async function updateCourierCurrentLocation(
  req: Request<{ id: string }, {}, { currentLocation: Point }>,
  res: Response
) {
  try {
    const id = req.params.id;
    const { currentLocation } = req.body;

    const [affectedRows] = await Courier.update(
      { currentLocation },
      {
        where: {
          id,
        },
      }
    );

    if (affectedRows > 0) {
      res.status(200).json({ message: "Current location updated successfully" });
    } else {
      res.status(404).json({ message: "Courier not found" });
    }
  } catch (error) {
    console.error("updateCourierCurrentLocation:", error);
    res.status(500).json({ error: "Error updating current location" });
  }
}
