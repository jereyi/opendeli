import request from "supertest";
import app from "../../index";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
var db = require("../../src/models/db"),
  sequelize = db.sequelize;

import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import Order from "../../src/models/order.model.js";
import Courier from "../../src/models/courier.model";
import Setting from "../../src/models/setting.model";
import { person1, person2, person3 } from "./utils/testData";

// get offers
// get offers with merchat id
// get offers with deliver time
// get offer
// accept offer
// reject offer
let offer1: Order;
let offer2: Order;
let offer3: Order;
let courier: Courier;

describe("Offers route", function () {
  let token: string;
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    console.log("Successfully run the function");

    // offer1 = await Order.create({
      
    // });
    courier = await Courier.create({
      ...person1,
      password: await bcrypt.hash(person1.password, 10),
    });
    const response = await request(app)
      .post("/auth/login")
      .send({ email: person1.email, password: person1.password })
      .set("Content-Type", "application/json");

    token = response.body.token;
    console.log("token", token);
  });

  // describe("GET /", function () {
  //   it("Should get all offers", async function () {
  //     const response = await get("", token, 200);
  //     const data = response.body;

  //     expect(data.offers.length).equals(3);
  //     expect(data.couriers).to.eql(
  //       [courier1.dataValues, courier2.dataValues, courier3.dataValues].map(
  //         (dataValues) => ({
  //           ...dataValues,
  //           createdAt: dataValues["createdAt"].toJSON(),
  //           updatedAt: dataValues["updatedAt"].toJSON(),
  //         })
  //       )
  //     );
  //   });
  // });

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
