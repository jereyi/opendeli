import request from "supertest";
import bcrypt from "bcrypt";
import app from "../../index";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
var db = require("../../src/models/db"),
  sequelize = db.sequelize;
import { faker } from "@faker-js/faker";
import { Point } from "geojson";
import Courier from "../../src/models/courier.model.js";
import {
  CuisineTypes,
  DeliverySpeed,
  DietaryRestrictions,
  FoodPreferences,
  OrderPreferences,
  OrderSetting,
  RestaurantTypes,
  UserStatus,
  VehicleType,
} from "../../src/utils/enum.util";
import { auth } from "./auth.test";
import Setting from "../../src/models/setting.model";
import { SettingsReqBody } from "../../src/reqBodies/couriers";
import { EarningGoals, PayRate } from "../../src/utils/types.util";
import { person1, person2, person3 } from "./utils/testData";
import { createPoint, createPolygon } from "./utils/helper";

let courier1: Courier;
let courier2: Courier;
let courier3: Courier;
let setting1: Setting;

describe("couriers route", function () {
  let token: string;
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    console.log("Successfully run the function");

    courier1 = await Courier.create({
      ...person1,
      password: await bcrypt.hash(person1.password, 10),
    });
    setting1 = await courier1.createSetting();
    courier2 = await Courier.create({
      ...person2,
      password: await bcrypt.hash(person2.password, 10),
    });
    courier3 = await Courier.create({
      ...person3,
      password: await bcrypt.hash(person3.password, 10),
    });
    const response = await request(app)
      .post("/auth/login")
      .send({ email: person1.email, password: person1.password })
      .set("Content-Type", "application/json");

    token = response.body.token;
    console.log("token", token);
  });
  describe("GET /", function () {
    // Should get couriers
    it("Should get all couriers", async function () {
      const response = await get("", token, 200);
      const data = response.body;

      expect(data.couriers.length).equals(3);
      expect(data.couriers).to.eql(
        [courier1.dataValues, courier2.dataValues, courier3.dataValues].map(
          (dataValues) => ({
            ...dataValues,
            createdAt: dataValues["createdAt"].toJSON(),
            updatedAt: dataValues["updatedAt"].toJSON(),
          })
        )
      );
    });

    it("Should get couriers and sort them by distance", async function () {
      const reqBody = {
        sortByDistance: true,
        location: createPoint(0.0, 0.0),
      };
      const response = await get("", token, 200, reqBody);
      const data = response.body;

      expect(data.couriers.length).equals(3);
      expect(data.couriers).to.eql(
        [courier3.dataValues, courier2.dataValues, courier1.dataValues].map(
          (dataValues) => ({
            ...dataValues,
            createdAt: dataValues["createdAt"].toJSON(),
            updatedAt: dataValues["updatedAt"].toJSON(),
            distance: dataValues["currentLocation"]?.coordinates[0],
          })
        )
      );
    });

    it("Should get available couriers", async function () {
      const reqBody = {
        checkIsAvailable: true,
      };
      const response = await get("", token, 200, reqBody);
      const data = response.body;

      expect(data.couriers.length).equals(1);
      expect(data.couriers).to.eql(
        [courier2.dataValues].map((dataValues) => ({
          ...dataValues,
          createdAt: dataValues["createdAt"].toJSON(),
          updatedAt: dataValues["updatedAt"].toJSON(),
        }))
      );
    });
  });

  describe("GET /:id", function () {
    it("Should get logged in courier", async function () {
      const response = await get(courier1.id, token, 200);
      const data = response.body;
      console.log("printing data", data);

      expect(data.courier).not.to.be.null;
      const expectedCourier = {
        ...courier1.dataValues,
        createdAt: courier1.dataValues["createdAt"].toJSON(),
        updatedAt: courier1.dataValues["updatedAt"].toJSON(),
      };
      expect(data.courier).to.eql(expectedCourier);
    });
  });

   describe("PATCH /:id", function () {
     it("Should update courier order settings", async function () {
       const reqBody = {
         orderSetting: OrderSetting.manual,
       };
       await patch(`${courier1.id}`, token, 200, reqBody);

       const courier = await Courier.findByPk(courier1.id);

       expect(courier).not.to.be.null;
       expect(courier?.orderSetting).to.eql("manual");
     });
     it("Should update courier status", async function () {
       const reqBody = {
         status: UserStatus.offline,
       };
       await patch(`${courier1.id}`, token, 200, reqBody);

       const courier = await Courier.findByPk(courier1.id);
       expect(courier).not.to.be.null;
       expect(courier?.status).to.eql(UserStatus.offline);
     });
     it("Should get courier current location", async function () {
       const reqBody = {
         currentLocation: createPoint(600.0, 0.0),
       };
       const data = await patch(`${courier1.id}`, token, 200, reqBody);

       const courier = await Courier.findByPk(courier1.id);
       expect(courier).not.to.be.null;
       expect(courier?.currentLocation?.type).to.eql(
         reqBody.currentLocation.type
       );
       expect(courier?.currentLocation?.coordinates).to.eql(
         reqBody.currentLocation.coordinates
       );
     });
   });

  describe("GET /full-settings/:id", function () {
    it("Should get courier full settings", async function () {
      const { settings } = (await get(`full-settings/${courier1.id}`, token, 200)).body;

      console.log("settings", settings);
      const expectedSettings = {
        ...setting1.dataValues,
        createdAt: setting1.dataValues["createdAt"].toJSON(),
        updatedAt: setting1.dataValues["updatedAt"].toJSON(),
      };
      expect(settings).not.to.be.null;
      expect(settings).to.eql(expectedSettings);
    });
  });
  describe("PATCH /full-settings/:id", function () {
    it("Should update courier full settings", async function () {
      const reqBody: SettingsReqBody = {
        deliveryPolygon: createPolygon([
          [-100.0, 100.0],
          [100.0, 100.0],
          [100.0, -100.0],
          [-100.0, -100.0],
        ]),
        vehicleType: VehicleType.motorcycle,
        preferredAreas: ["New York, NY", "Princeton, NJ", "Philidephia, PA"],
        // Note: Day is arbitrary, only time is relevant
        shiftAvailability: {
          sunday: [
            [new Date("March 17 2024 12:30"), new Date("March 17 2024 16:30")],
            [new Date("March 17 2024 17:30"), new Date("March 17 2024 20:30")],
          ],
          monday: [
            [new Date("March 17 2024 12:30"), new Date("March 17 2024 16:30")],
          ],
          tuesday: [
            [new Date("March 17 2024 12:30"), new Date("March 17 2024 16:30")],
          ],
          wednesday: [
            [new Date("March 17 2024 12:30"), new Date("March 17 2024 16:30")],
          ],
          thursday: [
            [new Date("March 17 2024 12:30"), new Date("March 17 2024 16:30")],
          ],
          friday: [
            [new Date("March 17 2024 12:30"), new Date("March 17 2024 16:30")],
          ],
          saturday: [
            [new Date("March 17 2024 12:30"), new Date("March 17 2024 16:30")],
            [new Date("March 17 2024 17:30"), new Date("March 17 2024 20:30")],
          ],
        },
        orderPreferences: [
          OrderPreferences.small_orders,
          OrderPreferences.medium_orders,
        ],
        foodPreferences: [FoodPreferences.cold],
        earningGoals: { daily: 100, weekly: 500 } as EarningGoals,
        deliverySpeed: DeliverySpeed.rush,
        restaurantTypes: [RestaurantTypes.local],
        cuisineTypes: [
          CuisineTypes.american,
          CuisineTypes.mediterranean,
        ],
        preferredRestaurantPartners: ["Sweetgreen", "Cava"],
        dietaryRestrictions: [
          DietaryRestrictions.vegan,
          DietaryRestrictions.organic,
        ],
        payRate: {
          hourlyRate: 15,
          perDeliveryRate: 5,
          distanceBasedRate: 0.5,
          surgePricingPreference: 7,
          minimumEarningsGuarantee: 50,
        } as PayRate,
      };
      const { settings } = (
        await patch(`full-settings/${courier1.id}`, token, 200, reqBody)
      ).body;

      console.log("settings", settings);
      expect(settings).not.to.be.null;
      expect(settings?.vehicleType).to.eql(reqBody.vehicleType);
      expect(settings?.deliveryPolygon?.coordinates).to.eql(
        reqBody.deliveryPolygon?.coordinates
      );
      expect(settings?.restaurantTypes).to.eql(reqBody.restaurantTypes);
      expect(settings?.earningGoals).to.eql(reqBody.earningGoals);
      expect(settings?.cuisineTypes).to.eql(reqBody.cuisineTypes);
      expect(settings?.deliverySpeed).to.eql(reqBody.deliverySpeed);
      expect(settings?.preferredRestaurantPartners).to.eql(
        reqBody.preferredRestaurantPartners
      );
      expect(settings?.orderPreferences).to.eql(
        reqBody.orderPreferences
      );
      expect(settings?.payRate).to.eql(reqBody.payRate);
      expect(settings?.dietaryRestrictions).to.eql(
        reqBody.dietaryRestrictions
      );
      expect(settings?.foodPreferences).to.eql(reqBody.foodPreferences);
      const expectedShiftAvailability = {
        sunday: reqBody.shiftAvailability?.sunday.map((dates) =>
          dates.map((date) => date.toJSON())
        ),
        monday: reqBody.shiftAvailability?.monday.map((dates) =>
          dates.map((date) => date.toJSON())
        ),
        tuesday: reqBody.shiftAvailability?.tuesday.map((dates) =>
          dates.map((date) => date.toJSON())
        ),
        wednesday: reqBody.shiftAvailability?.wednesday.map((dates) =>
          dates.map((date) => date.toJSON())
        ),
        thursday: reqBody.shiftAvailability?.thursday.map((dates) =>
          dates.map((date) => date.toJSON())
        ),
        friday: reqBody.shiftAvailability?.friday.map((dates) =>
          dates.map((date) => date.toJSON())
        ),
        saturday: reqBody.shiftAvailability?.saturday.map((dates) =>
          dates.map((date) => date.toJSON())
        ),
      };
      expect(settings?.shiftAvailability).to.eql(
        expectedShiftAvailability
      );
      expect(settings?.preferredAreas).to.eql(reqBody.preferredAreas);
    });
  });
 
  async function get(
    path: string,
    token: string,
    status = 200,
    reqBody?: object
  ) {
    const response = await request(app)
      .get(`/couriers/${path}`)
      .send(reqBody)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .expect(status);
    return response;
  }
  async function patch(
    path: string,
    token: string,
    status = 200,
    reqBody?: object
  ) {
    const response = await request(app)
      .patch(`/couriers/${path}`)
      .send(reqBody)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(status);
    return response;
  }
});
