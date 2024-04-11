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

let inprogressDelivery1: Order;
let offer2: Order;
let offer3: Order;
let courier2: Courier;
let location1: Location;
let location3: Location;
let comment1: Comment;
let comment3: Comment;
let merchant1: Merchant;

describe("Offers route", function () {
  let token: string;
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    console.log("Successfully run the function");

    ({
      courier2,
      merchant1,
      location1,
      location3,
      comment1,
      comment3,
      inprogressDelivery1,
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
    it("Should get all offers", async function () {
      const response = await post("", token, 200);
      const offers = response.body.offers;
      console.log(offers);

      expect(offers.length).equals(2);
      checkOrders(offers[0], offer2);
      checkOrders(offers[1], offer3);
      expect(offers[0].Locations?.length).equals(2);
      expect(offers[1].Locations?.length).equals(2);
      checkLocations(offers[0].pickupLocation, location1);
      checkLocations(offers[0].dropoffLocation, location3);
      checkLocations(offers[1].pickupLocation, location1);
      checkLocations(offers[1].dropoffLocation, location3);
      checkMerchants(offers[0].Merchant, merchant1);
      checkMerchants(offers[1].Merchant, merchant1);
      checkComments(offers[0].Merchant.Comments[0], comment1);
      checkComments(offers[1].Merchant.Comments[0], comment1);
      checkComments(offers[0].dropoffLocation.Comments[0], comment3);
      checkComments(offers[1].dropoffLocation.Comments[0], comment3);
    });
  });
  describe("GET /:id", function () {
    it("Should get offer", async function () {
      const response = await get(`/${offer2.id}`, token, 200);
      const { offer } = response.body;
      expect(offer).not.to.be.null;
      checkOrders(offer, offer2);
    });
    it("Should not get delivery offer", async function () {
      const response = await get(`/${inprogressDelivery1.id}`, token, 404);
      const { offer } = response.body;
      expect(offer).toBeUndefined();
    });
  });
  describe("GET /accpet/:id", function () {
    it("Should accept offer", async function () {
      await post(`/accept/${offer2.id}`, token, 200, {
        courierId: courier2.id,
      });

      const courier = await Courier.findByPk(courier2.id, {
        include: { model: Order, as: "AcceptedOrders" },
      });
      expect(courier?.AcceptedOrders?.length).equals(1);
      expect(courier?.AcceptedOrders?.at(0)?.id).equals(offer2.id);
    });
    it("Should not overwrite courier if status is not 'created'", async function () {
      const response = await post(
        `/accept/${inprogressDelivery1.id}`,
        token,
        404,
        {
          CourierId: courier2.id,
        }
      );
      const data = response.body;
      expect(data.offer).toBeUndefined();
    });
  });
  describe("GET /reject/:id", function () {
    it("Should reject offer", async function () {
      const response = await post(`/reject/${offer3.id}`, token, 200, {
        courierId: courier2.id,
      });
      const { courier } = response.body;
      expect(courier).not.to.be.null;
      expect(courier.rejectedOffers.length).equals(1);
      expect(courier.rejectedOffers[0]).to.eql(offer3.id);
    });
    it("Should not reject offer twice", async function () {
      await post(`/reject/${offer3.id}`, token, 200, {
        courierId: courier2.id,
      });
      const response = await post(`/reject/${offer3.id}`, token, 400, {
        courierId: courier2.id,
      });
      const data = response.body;
      expect(data.courier).toBeUndefined();
    });
  });

  async function get(
    path: string,
    token: string,
    status = 200,
    reqBody?: object
  ) {
    const response = await request(app)
      .get(`/offers/${path}`)
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
      .post(`/offers/${path}`)
      .send(reqBody)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(status);
    return response;
  }
});
