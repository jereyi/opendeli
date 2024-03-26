import { Request, Response } from "express";
import Courier from "../models/courier.model";
import {
  CouriersReqBody,
  ProfileReqBody,
  SettingsReqBody,
} from "../reqBodies/couriers";
import Setting from "../models/setting.model";
import { OrderSetting, UserStatus } from "../utils/enum.util";
import { Point } from "geojson";
import { QueryTypes } from "sequelize";
var db = require("../models/db"),
  sequelize = db.sequelize;

// TODO: Test use delivery polygon flag in Postman
export async function getCouriers(
  req: Request<{}, {}, CouriersReqBody>,
  res: Response
) {
  try {
    const { checkIsAvailable, sortByDistance, useDeliveryPolygon, location } =
      req.body;

    let baseQuery;
    let replacements;
    if (location) {
      baseQuery = `SELECT *, ST_Distance(ST_SetSRID(ST_MakePoint(:latitude, :longitude), 4326), "currentLocation") AS distance FROM "couriers"`;
      const [latitude, longitude] = location.coordinates;
      replacements = { latitude, longitude };
    } else {
      baseQuery = `SELECT * FROM "couriers"`;
    }
    const deliveryPolygonQuery = `ST_Intersects(ST_SetSRID(ST_MakePoint(:latitude, :longitude), 4326), "deliveryPolygon")`;
    const isAvailableQuery = `status = 'online' OR status = 'last_call'`;
    const sortByDistanceQuery = "ORDER BY distance ASC";

    if (useDeliveryPolygon) {
      baseQuery += " WHERE " + deliveryPolygonQuery;
    }
    if (checkIsAvailable) {
      baseQuery +=
        (useDeliveryPolygon ? " AND " : " WHERE ") + isAvailableQuery;
    }
    if (sortByDistance) {
      baseQuery += " " + sortByDistanceQuery;
    }

    const rows = await sequelize.query(baseQuery, {
      replacements,
      model: Courier,
      type: QueryTypes.SELECT,
    });
  
    res.status(200).json({ couriers: rows.map((courier: Courier) => courier.dataValues) });
  } catch (error) {
    console.error("getCouriers:", error);
    res.status(500).json({ error: "Error fetching couriers" });
  }
}

export async function getCourier(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;
    const courier = await Courier.findByPk(id);

    if (courier) {
      console.log("datavals", courier.dataValues)
      res.status(200).json({ courier: courier.dataValues });
    } else {
      res.status(404).json({ message: "Courier not found" });
    }
  } catch (error) {
    console.error("getCourier:", error);
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
    // if (profilePicture) {
    //   updates.imageType = profilePicture.type;
    //   updates.imageName = profilePicture.name;
    //   updates.imageData = await profilePicture.arrayBuffer();
    // }

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
    const courier = await Courier.findByPk(id, { include: Setting });

    if (courier) {
      console.log("Courier settings fetched successfully");
      res.status(200).json({ settings: courier.Setting?.dataValues});
    } else {
      console.log("Courier not found")
      res.status(404).json({ message: "Courier not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching courier setting" });
  }
}

// TODO: Test this method in Postman
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
      cuisineTypes,
      preferredRestaurantPartners,
      dietaryRestrictions,
      payRate,
    } = req.body;
    const courier = await Courier.findByPk(id);
    const setting: any = {};
    if (courier) {
      // NOTE: You may have to manipulate these object to make them fit in DB
      if (deliveryPolygon) setting.deliveryPolygon = deliveryPolygon;
      if (vehicleType) setting.vehicleType = vehicleType;
      if (preferredAreas) setting.preferredAreas = preferredAreas;
      if (shiftAvailability) setting.shiftAvailability = shiftAvailability;
      if (orderPreferences) setting.orderPreferences = orderPreferences;
      if (foodPreferences) setting.foodPreferences = foodPreferences;
      if (earningGoals) setting.earningGoals = earningGoals;
      if (deliverySpeed) setting.deliverySpeed = deliverySpeed;
      if (restaurantTypes) setting.restaurantTypes = restaurantTypes;
      if (cuisineTypes) setting.cuisineTypes = cuisineTypes;
      if (preferredRestaurantPartners)
        setting.preferredRestaurantPartners = preferredRestaurantPartners;
      if (dietaryRestrictions)
        setting.dietaryRestrictions = dietaryRestrictions;
      if (payRate) setting.payRate = payRate;

      const [count, rows]  = await Setting.update(setting, {
        where: {
          CourierId: id,
        },
        returning: true
      });
      if (count) {
        console.log("Settings updated successfully");
        res.status(200).json({ settings: rows[0].dataValues });
      } else {
        console.log("Error updating courier setting");
        res.status(500).json({ message: "Error updating courier setting" });
      }
    } else {
      console.log("Courier not found");
      res.status(404).json({ message: "Courier not found" });
    }
  } catch (error) {
    console.error("updateCourierFullSettings:", error);
    res.status(500).json({ error: "Error updating courier setting" });
  }
}

export async function updateCourierStatus(
  req: Request<{ id: string }, {}, { status: UserStatus }>,
  res: Response
) {
  try {
    const id = req.params.id;
    const { status } = req.body;

    console.log(status)

    const [affectedCount, affectedRows] = await Courier.update(
      { status },
      {
        where: {
          id,
        },
        returning: true,
      }
    );

    if (affectedCount > 0) {
      console.log("Status updated successfully");
      res.status(200).json({ courier: affectedRows[0].dataValues});
    } else {
      console.log("Courier not found");
      res.status(404).json({ message: "Courier not found" });
    }
  } catch (error) {
    console.error("updateCourierStatus:", error);
    res.status(500).json({ error: "Error updating status" });
  }
}

export async function updateCourierOrderSetting(
  req: Request<{ id: string }, {}, { orderSetting: OrderSetting }>,
  res: Response
) {
  try {
    const id = req.params.id;
    const { orderSetting } = req.body;

    const [affectedCount, affectedRows] = await Courier.update(
      { orderSetting },
      {
        where: {
          id,
        },
        returning: true
      }
    );

    if (affectedCount > 0) {
      res.status(200).json({ courier: affectedRows[0].dataValues});
    } else {
      console.log("Courier not found")
      res.status(404).json({ message: "Courier not found" });
    }
  } catch (error) {
    console.error("updateCourierOrderSetting:", error);
    res.status(500).json({ error: "Error updating order setting" });
  }
}

// NOTE: Current location must be specified in geoJson format (https://geojson.org/geojson-spec.html)
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
      res
        .status(200)
        .json({ message: "Current location updated successfully" });
    } else {
      res.status(404).json({ message: "Courier not found" });
    }
  } catch (error) {
    console.error("updateCourierCurrentLocation:", error);
    res.status(500).json({ error: "Error updating current location" });
  }
}
