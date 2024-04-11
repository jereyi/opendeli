import request from "supertest";
import app from "../../index";
import { beforeEach, describe, expect, it } from "vitest";
var db = require("../../src/models/db"),
  sequelize = db.sequelize;

import Order from "../../src/models/order.model.js";
import Courier from "../../src/models/courier.model";
import Location from "../../src/models/location.model";
import Comment from "../../src/models/comment.model";
import Merchant from "../../src/models/merchant.model";
import {
  checkOrders,
  checkLocations,
  checkMerchants,
  checkComments,
  populateDB,
} from "./utils/helper";
import { person1 } from "./utils/testData";
import { OrderStatus } from "../../src/utils/enum.util";
import { faker } from "@faker-js/faker";

let inprogressDelivery1: Order;
let inprogressDelivery2: Order;
let completedDelivery1: Order;
let offer2: Order;
let offer3: Order;
let courier2: Courier;
let location1: Location;
let location2: Location;
let location4: Location;
let comment1: Comment;
let comment2: Comment;
let merchant1: Merchant;

describe("Deliveries route", function () {
  let token: string;
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    console.log("Successfully run the function");

    ({
      courier2,
      merchant1,
      location1,
      location2,
      location4,
      comment1,
      comment2,
      inprogressDelivery1,
      inprogressDelivery2,
      completedDelivery1,
      offer2,
      offer3,
    } = await populateDB());

    const response = await request(app)
      .post("/auth/login")
      .send({ email: person1.email, password: person1.password })
      .set("Content-Type", "application/json");

    token = response.body.token;
    console.log("token ", token);
  });

  describe("GET /", function () {
    it("Should get all deliveries", async function () {
      const response = await post("", token, 200);
      const { deliveries } = response.body;
      console.log(deliveries);

      expect(deliveries.length).equals(3);
      checkOrders(deliveries[0], inprogressDelivery1);
      checkOrders(deliveries[1], inprogressDelivery2);
      checkOrders(deliveries[2], completedDelivery1);
      expect(deliveries[0].Locations?.length).equals(2);
      expect(deliveries[1].Locations?.length).equals(2);
      expect(deliveries[2].Locations?.length).equals(2);
      checkLocations(deliveries[0].pickupLocation, location1);
      checkLocations(deliveries[0].dropoffLocation, location2);
      checkLocations(deliveries[1].pickupLocation, location1);
      checkLocations(deliveries[1].dropoffLocation, location2);
      checkLocations(deliveries[2].pickupLocation, location1);
      checkLocations(deliveries[2].dropoffLocation, location4);
      checkMerchants(deliveries[0].Merchant, merchant1);
      checkMerchants(deliveries[1].Merchant, merchant1);
      checkMerchants(deliveries[2].Merchant, merchant1);
      checkComments(deliveries[0].Merchant.Comments[0], comment1);
      checkComments(deliveries[1].Merchant.Comments[0], comment1);
      checkComments(deliveries[2].Merchant.Comments[0], comment1);
      checkComments(deliveries[0].dropoffLocation.Comments[0], comment2);
      checkComments(deliveries[1].dropoffLocation.Comments[0], comment2);
      expect(deliveries[2].dropoffLocation.Comments.length).equals(0);
    });
  });
  describe("GET /:id", function () {
    it("Should get delivery", async function () {
      const response = await get(`/${inprogressDelivery1.id}`, token, 200);
      const { delivery } = response.body;
      expect(delivery).not.to.be.null;
      checkOrders(delivery, inprogressDelivery1);
    });
    it("Should not get delivery offer", async function () {
      const response = await get(`/${offer2.id}`, token, 404);
      const { delivery } = response.body;
      expect(delivery).toBeUndefined();
    });
  });
  describe("PATCH /status/:id", function () {
    it("Update delivery status to picked up", async function () {
      const response = await patch(
        `/status/${inprogressDelivery1.id}`,
        token,
        200,
        {
          status: OrderStatus.picked_up,
        }
      );

      const { delivery } = response.body;

      expect(delivery.status).equals(OrderStatus.picked_up);
    });
    it("Should not update status to dropped off", async function () {
      const response = await patch(
        `/status/${inprogressDelivery1.id}`,
        token,
        400,
        {
          status: OrderStatus.dropped_off,
        }
      );

      const { delivery } = response.body;

      expect(delivery).toBeUndefined();
    });
  });
  describe("PATCH /mark-as-delivered/:id", function () {
    it("Should mark as delivered offer", async function () {
      const reqBody = {
        notes: [faker.lorem.sentence(1)],
        photo: {
          type: "image/jpeg",
          name: "test.jpg",
        },
      };
      const response = await patch(
        `/mark-as-delivered/${inprogressDelivery2.id}`,
        token,
        200,
        reqBody
      );
      const { delivery } = response.body;
      expect(delivery).not.to.be.null;
      expect(delivery.status).equals(OrderStatus.dropped_off);
      expect(delivery.courierNotes).eql(reqBody.notes);
      expect(delivery.imageName).equals(reqBody.photo.name);
      expect(delivery.imageType).equals(reqBody.photo.type);
    });
  });

  async function get(
    path: string,
    token: string,
    status = 200,
    reqBody?: object
  ) {
    const response = await request(app)
      .get(`/deliveries/${path}`)
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token)
      .expect(status);
    return response;
  }
  async function post(
    path: string,
    token: string,
    status = 200,
    reqBody?: object
  ) {
    const response = await request(app)
      .post(`/deliveries/${path}`)
      .send(reqBody)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
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
      .patch(`/deliveries/${path}`)
      .send(reqBody)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(status);
    return response;
  }
});
