import request from "supertest";
import app from "../../index";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
var db = require("../../src/models/db"),
  sequelize = db.sequelize;
import { faker } from "@faker-js/faker";
import Courier from "../../src/models/courier.model.js";
import Setting from "../../src/models/setting.model";

describe("auth route", function () {
  describe("POST /signup", function () {
    beforeEach(async () => {
      await sequelize.sync({ force: true });
      console.log("Successfully run the function");
    });

    it("Should register courier successfully", async function () {
      const reqBody = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phoneNumber: faker.phone.number(),
      };
      const response = await auth("signup", reqBody, 201);
      const data = response.body;

      expect(data.message).equals("Courier registered successfully");

      const couriers = await Courier.findAll({
        where: {
          firstName: reqBody.firstName,
          lastName: reqBody.lastName,
          email: reqBody.email,
          phoneNumber: reqBody.phoneNumber,
        },
        include: Setting,
      });
    });

    it("Should register courier successfully without phone number", async function () {
      const reqBody = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const response = await auth("signup", reqBody, 201);
      const data = response.body;

      expect(data.message).equals("Courier registered successfully");

      const couriers = await Courier.findAll({
        where: {
          firstName: reqBody.firstName,
          lastName: reqBody.lastName,
          email: reqBody.email,
        },
        include: Setting,
      });

      expect(couriers.length).equals(1);
      expect(couriers[0].phoneNumber).is.null;
    });

    it("Should fail to register courier without email", async function () {
      const reqBody = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: faker.internet.password(),
      };
      const response = await auth("signup", reqBody, 400);
      const data = response.body;

      expect(data.error).equals(
        "Courier must have a first name, last name, email address, and password"
      );
    });

    it("Should not register courier with duplicate email", async function () {
      const reqBody = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      await auth("signup", reqBody, 201);
      const response = await auth("signup", reqBody, 200);
      const data = response.body;

      expect(data.message).equals("Courier already exists");
    });
  });

  describe("POST /login", function () {
    beforeEach(async () => {
      await sequelize.sync({ force: true });
      console.log("Successfully run the function");
    });

    it("Should login courier successfully", async function () {
      const reqBody = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phoneNumber: faker.phone.number(),
      };
      await auth("signup", reqBody, 201);
      const response = await auth(
        "login",
        { email: reqBody.email, password: reqBody.password },
        200
      );
      const data = response.body;

      expect(data.token).not.null;
    });

    it("Should fail to login in courier with wrong password", async function () {
      const reqBody = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phoneNumber: faker.phone.number(),
      };
      await auth("signup", reqBody, 201);
      const response = await auth(
        "login",
        { email: reqBody.email, password: "Wrong Password" },
        401
      );
      const data = response.body;

      expect(data.error).equals("Password does not match");
    });

    it("Should fail to login courier with invalid email", async function () {
      const reqBody = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phoneNumber: faker.phone.number(),
      };
      await auth("signup", reqBody, 201);
      const response = await auth(
        "login",
        { email: faker.internet.email(), password: faker.internet.password() },
        401
      );
      const data = response.body;

      expect(data.error).equals("Courier does not exist");
    });

    it("Should fail to login courier with no email", async function () {
      const reqBody = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phoneNumber: faker.phone.number(),
      };
      await auth("signup", reqBody, 201);
      const response = await auth(
        "login",
        {
          password: faker.internet.password(),
        },
        400
      );
      const data = response.body;

      expect(data.error).equals(
        "Must provide email address and password to log in"
      );
    });
  });

  describe("POST /password-reset", function () {
    beforeEach(async () => {
      await sequelize.sync({ force: true });
      console.log("Successfully run the function");
    });

    it("Should reset password successfully", async function () {
      const reqBody = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phoneNumber: faker.phone.number(),
      };
      await auth("signup", reqBody, 201);

      let couriers = await Courier.findAll({
        where: {
          firstName: reqBody.firstName,
          lastName: reqBody.lastName,
          email: reqBody.email,
        },
        include: Setting,
      });
      const oldPassword = couriers[0].password;

      const response = await auth(
        "password-reset",
        {
          email: reqBody.email,
          password: reqBody.password,
          newPassword: faker.internet.password(),
        },
        200
      );

      couriers = await Courier.findAll({
        where: {
          firstName: reqBody.firstName,
          lastName: reqBody.lastName,
          email: reqBody.email,
        },
        include: Setting,
      });

      const data = response.body;
      expect(data.message).equals("Password reset successfully");
      expect(couriers[0].password).not.equals(oldPassword);
    });

    it("Should fail to reset password with wrong password", async function () {
      const reqBody = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phoneNumber: faker.phone.number(),
      };
      await auth("signup", reqBody, 201);
      const response = await auth(
        "password-reset",
        {
          email: reqBody.email,
          password: "Wrong Password",
          newPassword: faker.internet.password(),
        },
        401
      );
      const data = response.body;

      expect(data.error).equals("Password does not match");
    });

     it("Should fail to reset password with invalid email", async function () {
       const reqBody = {
         firstName: faker.person.firstName(),
         lastName: faker.person.lastName(),
         email: faker.internet.email(),
         password: faker.internet.password(),
         phoneNumber: faker.phone.number(),
       };
       await auth("signup", reqBody, 201);
       const response = await auth(
         "password-reset",
         {
           email: faker.internet.email(),
           password: reqBody.password,
           newPassword: faker.internet.password(),
         },
         401
       );
       const data = response.body;

       expect(data.error).equals("Courier does not exist");
     });

    it("Should fail to reset password if no new password specified", async function () {
      const reqBody = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phoneNumber: faker.phone.number(),
      };
      await auth("signup", reqBody, 201);
      const response = await auth(
        "password-reset",
        { email: reqBody.email, password: reqBody.password },
        400
      );
      const data = response.body;

      expect(data.error).equals(
        "Must provide email address, old password, and new password to reset password"
      );
    });
  });

  async function auth(path: string, reqBody: object | undefined, status = 200) {
    const response = await request(app)
      .post(`/auth/${path}`)
      .send(reqBody)
      .set("Content-Type", "application/json")
      .expect(status);
    return response;
  }
});
