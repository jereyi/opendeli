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
  VehicleType,
} from "../../src/utils/enum.util";
import { auth } from "./auth.test";
import Setting from "../../src/models/setting.model";
import { SettingsReqBody } from "../../src/reqBodies/couriers";
import { EarningGoals, PayRate } from "../../src/utils/types.util";

let courier1: Courier;
let courier2: Courier;
let courier3: Courier;
let setting1: Setting;
const person1 = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: "",
  password: faker.internet.password(),
  phoneNumber: faker.phone.number(),
  isAvailable: true,
  orderSetting: OrderSetting[0] as unknown as OrderSetting,
  currentLocation: { type: "Point", coordinates: [300.0, 0.0] } as Point,
};
person1.email = faker.internet.email({
  firstName: person1.firstName,
  lastName: person1.lastName,
});
const person2 = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: "",
  password: faker.internet.password(),
  phoneNumber: faker.phone.number(),
  isAvailable: true,
  orderSetting: OrderSetting[1] as unknown as OrderSetting,
  currentLocation: { type: "Point", coordinates: [200.0, 0.0] } as Point,
};
person2.email = faker.internet.email({
  firstName: person2.firstName,
  lastName: person2.lastName,
});
const person3 = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: "",
  password: faker.internet.password(),
  phoneNumber: faker.phone.number(),
  isAvailable: false,
  orderSetting: OrderSetting[2] as unknown as OrderSetting,
  currentLocation: { type: "Point", coordinates: [100.0, 0.0] } as Point,
};
person3.email = faker.internet.email({
  firstName: person3.firstName,
  lastName: person3.lastName,
});

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
        location: { type: "Point", coordinates: [0.0, 0.0] } as Point,
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

      expect(data.couriers.length).equals(2);
      expect(data.couriers).to.eql(
        [courier1.dataValues, courier2.dataValues].map((dataValues) => ({
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

  describe("PATCH /profile/:id", function () {
    it("Should update courier profile", async function () {
      const reqBody = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      };
      const response = await patch(
        `profile/${courier1.id}`,
        token,
        200,
        reqBody
      );

      const expectedCourier = await Courier.findByPk(courier1.id);
      expect(expectedCourier).not.to.be.null;
      expect(expectedCourier?.firstName).to.eql(reqBody.firstName);
      expect(expectedCourier?.lastName).to.eql(reqBody.lastName);
    });
  });
  describe("GET /profile/:id", function () {
    it("Should update courier profile", async function () {
      const reqBody = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      };
      await patch(`profile/${courier1.id}`, token, 200, reqBody);

      const updatedCourier = await Courier.findByPk(courier1.id);
      expect(updatedCourier).not.to.be.null;
      expect(updatedCourier?.firstName).to.eql(reqBody.firstName);
      expect(updatedCourier?.lastName).to.eql(reqBody.lastName);
    });
  });
  describe("GET /full-settings/:id", function () {
    it("Should get courier full settings", async function () {
      const data = (await get(`full-settings/${courier1.id}`, token, 200)).body;

      console.log("setting", data.setting);
      const expectedSetting = {
        ...setting1.dataValues,
        createdAt: setting1.dataValues["createdAt"].toJSON(),
        updatedAt: setting1.dataValues["updatedAt"].toJSON(),
      };
      expect(data.setting).not.to.be.null;
      expect(data.setting).to.eql(expectedSetting);
    });
  });
  describe("PATCH /full-settings/:id", function () {
    it("Should update courier full settings", async function () {
      const reqBody: SettingsReqBody = {
        deliveryPolygon: {
          type: "Polygon",
          coordinates: [
            [
              [-100.0, 100.0],
              [100.0, 100.0],
              [100.0, -100.0],
              [-100.0, -100.0],
            ],
          ],
        },
        vehicleType: "motorcycle" as unknown as VehicleType,
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
          "small_orders",
          "medium_orders",
        ] as unknown as OrderPreferences[],
        foodPreferences: ["cold"] as unknown as FoodPreferences[],
        earningGoals: { daily: 100, weekly: 500 } as EarningGoals,
        deliverySpeed: "rush" as unknown as DeliverySpeed,
        restaurantTypes: ["local"] as unknown as RestaurantTypes[],
        cuisineTypes: [
          "american",
          "mediterranean",
        ] as unknown as CuisineTypes[],
        preferredRestaurantPartners: ["Sweetgreen", "Cava"],
        dietaryRestrictions: [
          "vegan",
          "organic",
        ] as unknown as DietaryRestrictions[],
        payRate: {
          hourlyRate: 15,
          perDeliveryRate: 5,
          distanceBasedRate: 0.5,
          surgePricingPreference: 7,
          minimumEarningsGuarantee: 50,
        } as PayRate,
      };
      const data = (
        await patch(`full-settings/${courier1.id}`, token, 200, reqBody)
      ).body;

      console.log("setting", data.setting);
      const courier = await Courier.findByPk(courier1.id, {
        include: Setting,
      });
      const expectedSetting = courier?.Setting?.dataValues;
      console.log(courier?.Setting?.dataValues);
      expect(expectedSetting).not.to.be.null;
      expect(expectedSetting?.vehicleType).to.eql(reqBody.vehicleType);
      expect(expectedSetting?.deliveryPolygon?.coordinates).to.eql(
        reqBody.deliveryPolygon?.coordinates
      );
      expect(expectedSetting?.restaurantTypes).to.eql(reqBody.restaurantTypes);
      expect(expectedSetting?.earningGoals).to.eql(reqBody.earningGoals);
      expect(expectedSetting?.cuisineTypes).to.eql(reqBody.cuisineTypes);
      expect(expectedSetting?.deliverySpeed).to.eql(reqBody.deliverySpeed);
      expect(expectedSetting?.preferredRestaurantPartners).to.eql(
        reqBody.preferredRestaurantPartners
      );
      expect(expectedSetting?.orderPreferences).to.eql(
        reqBody.orderPreferences
      );
      expect(expectedSetting?.payRate).to.eql(reqBody.payRate);
      expect(expectedSetting?.dietaryRestrictions).to.eql(
        reqBody.dietaryRestrictions
      );
      expect(expectedSetting?.foodPreferences).to.eql(reqBody.foodPreferences);
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
      expect(expectedSetting?.shiftAvailability).to.eql(
        expectedShiftAvailability
      );
      expect(expectedSetting?.preferredAreas).to.eql(reqBody.preferredAreas);
    });
  });
  describe("PATCH /order-settings/:id", function () {
    it("Should update courier order settings", async function () {
      const reqBody = {
        orderSetting: "manual" as unknown as OrderSetting,
      };
      await patch(`order-settings/${courier1.id}`, token, 200, reqBody);

      const courier = await Courier.findByPk(courier1.id);

      expect(courier).not.to.be.null;
      expect(courier?.orderSetting).to.eql("manual");
    });
  });
  describe("PATCH /availability/:id", function () {
    it("Should update courier availability", async function () {
      const reqBody = {
        isAvailable: false,
      };
      await patch(`availability/${courier1.id}`, token, 200, reqBody);

      const courier = await Courier.findByPk(courier1.id);
      expect(courier).not.to.be.null;
      expect(courier?.isAvailable).to.eql(false);
    });
  });
  describe("PATCH /current-location/:id", function () {
      it("Should get courier current location", async function () {
        const reqBody = {
          currentLocation: {
            type: "Point",
            coordinates: [600.0, 0.0],
          } as Point,
        };
          const data = await patch(`current-location/${courier1.id}`, token, 200, reqBody);

      const courier = await Courier.findByPk(courier1.id);
      expect(courier).not.to.be.null;
      expect(courier?.currentLocation?.coordinates).to.eql(reqBody.currentLocation.coordinates);
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
    };
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
    };
});
