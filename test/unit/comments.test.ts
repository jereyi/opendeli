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

let comment1: Comment;
let comment2: Comment;
let comment3: Comment;
let courier1: Courier;
let merchant1: Merchant;
let location1: Location;

describe("Comments route", function () {
  let token: string;
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    console.log("Successfully run the function");

    ({ comment1, comment2, comment3, courier1, merchant1, location1 } =
      await populateDB());

    const response = await request(app)
      .post("/auth/login")
      .send({ email: person1.email, password: person1.password })
      .set("Content-Type", "application/json");

    token = response.body.token;
    console.log("token ", token);
  });

  describe("GET /", function () {
    it("Should get all comments", async function () {
      const response = await get("", token, 200);
      const { comments } = response.body;

      expect(comments.length).equals(3);
      checkComments(comments[0], comment1);
      checkComments(comments[1], comment2);
      checkComments(comments[2], comment3);
    });
  });
  describe("GET /:id", function () {
    it("Should get comment", async function () {
      const response = await get(`/${comment1.id}`, token, 200);
      const { comment } = response.body;
      expect(comment).not.to.be.null;
      checkComments(comment, comment1);
    });
  });
  describe("POST /", function () {
    it("Should create comment", async function () {
      const reqBody = {
        text: faker.lorem.text(),
        CourierId: courier1.id,
        MerchantId: merchant1.id,
      };
      const response = await post("", token, 200, reqBody);

      let { comment } = response.body;

      expect(comment.text).eql(reqBody.text);
      expect(comment.likes).equals(0);
      expect(comment.likers).eql([]);
      expect(comment.CourierId).eql(reqBody.CourierId);
      expect(comment.commentableId).eql(reqBody.MerchantId);
      expect(comment.commentableType).equals("merchant");

      comment = await Comment.findByPk(comment.id, { include: Merchant });
      let merchant = await comment.getCommentable();

      checkMerchants(comment.commentable, merchant1);
      checkMerchants(merchant!, merchant1);

      merchant = await Merchant.findByPk(merchant1.id, { include: Comment });
      checkComments(comment, merchant.Comments[1]);
    });
    it("Should not create comment without text", async function () {
      const reqBody = {
        CourierId: courier1.id,
        MerchantId: merchant1.id,
      };
      const response = await post("", token, 400, reqBody);

      const { comment } = response.body;

      expect(comment).toBeUndefined();
    });
    it("Should not create comment without courier", async function () {
      const reqBody = {
        text: faker.lorem.text(),
        MerchantId: merchant1.id,
      };
      const response = await post("", token, 400, reqBody);

      const { comment } = response.body;

      expect(comment).toBeUndefined();
    });
    it("Should not create comment without merchant or location", async function () {
      const reqBody = {
        text: faker.lorem.text(),
        CourierId: courier1.id,
      };
      const response = await post("", token, 400, reqBody);

      const { comment } = response.body;

      expect(comment).toBeUndefined();
    });

    it("Should not create comment with both merchant and location", async function () {
      const reqBody = {
        text: faker.lorem.text(),
        CourierId: courier1.id,
        MerchantId: merchant1.id,
        LocationId: location1.id,
      };
      const response = await post("", token, 400, reqBody);

      const { comment } = response.body;

      expect(comment).toBeUndefined();
    });
  });
  describe("PATCH /:id", function () {
    it("Should update comment text", async function () {
      const reqBody = {
        text: faker.lorem.sentence(1),
        CourierId: courier1.id,
      };
      const response = await patch(`/${comment1.id}`, token, 200, reqBody);
      const { comment } = response.body;
      expect(comment).toBeDefined();
      expect(comment.id).eql(comment1.id);
      expect(comment.text).eql(reqBody.text);
      expect(comment.CourierId).eql(reqBody.CourierId);
    });
    it("Should like comment", async function () {
      const reqBody = {
        likes: faker.number.int({ min: 0, max: 1000 }),
        CourierId: courier1.id,
      };
      const response = await patch(`/${comment1.id}`, token, 200, reqBody);
      const { comment } = response.body;
      expect(comment).toBeDefined();
      expect(comment.id).eql(comment1.id);
      expect(comment.likes).equals(1);
      expect(comment.likers).eql([courier1.id]);
    });
    it("Should not like comment twice", async function () {
      const reqBody = {
        likes: faker.number.int({ min: 0, max: 1000 }),
        CourierId: courier1.id,
      };
      await patch(`/${comment1.id}`, token, 200, reqBody);
      const response = await patch(`/${comment1.id}`, token, 200, reqBody);
      const { comment } = response.body;
      expect(comment).toBeDefined();
      expect(comment.id).eql(comment1.id);
      expect(comment.likes).equals(1);
      expect(comment.likers).eql([courier1.id]);
    });
  });
  describe("DELETE /:id", function () {
    it("Should delete comment", async function () {
      await del(`/${comment1.id}`, token, 200);

      const comment = await Comment.findByPk(comment1.id);
      expect(comment).toBeNull();
      let comments = await merchant1.getComments();
      expect(comments.length).equals(0);
      comments = await courier1.getComments();
      expect(comments.length).equals(1);
    });
  });

  async function get(path: string, token: string, status = 200) {
    const response = await request(app)
      .get(`/comments/${path}`)
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
      .post(`/comments/${path}`)
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
      .patch(`/comments/${path}`)
      .send(reqBody)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(status);
    return response;
  }
  async function del(path: string, token: string, status = 200) {
    const response = await request(app)
      .delete(`/comments/${path}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(status);
    return response;
  }
});
