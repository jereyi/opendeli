import { faker } from "@faker-js/faker";
import {
  OrderSetting, OrderStatus, UserStatus,
} from "../../../src/utils/enum.util";
import { Point } from "geojson";
import { createPoint } from "./helper";
import Courier from "../../../src/models/courier.model";
export const person1 = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: "",
  password: faker.internet.password(),
  phoneNumber: faker.phone.number(),
  isAvailable: UserStatus.last_call,
  orderSetting: OrderSetting.auto_accept,
  currentLocation: { type: "Point", coordinates: [300.0, 0.0] } as Point,
};
person1.email = faker.internet.email({
  firstName: person1.firstName,
  lastName: person1.lastName,
});
export const person2 = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: "",
  password: faker.internet.password(),
  phoneNumber: faker.phone.number(),
  status: UserStatus.online,
  orderSetting: OrderSetting.auto_reject,
  currentLocation: { type: "Point", coordinates: [200.0, 0.0] } as Point,
};
person2.email = faker.internet.email({
  firstName: person2.firstName,
  lastName: person2.lastName,
});
export const person3 = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: "",
  password: faker.internet.password(),
  phoneNumber: faker.phone.number(),
  status: UserStatus.offline,
  orderSetting: OrderSetting.manual,
  currentLocation: { type: "Point", coordinates: [100.0, 0.0] } as Point,
};
person3.email = faker.internet.email({
  firstName: person3.firstName,
  lastName: person3.lastName,
});

const item1 = {
    name: faker.commerce.productName(),
    quantity: faker.number.int({ max: 100 }),
    size: "small",
    price: faker.commerce.price(),
    length: 10,
    width: 10,
    height: 10,
    weigjt: 100,
    keepUpright: true,
    confirmed: true
}

const item2 = {
    name: faker.commerce.productName(),
    quantity: faker.number.int({ max: 200 }),
    size: "small",
    price: faker.commerce.price(),
    length: 20,
    width: 20,
    height: 20,
    weigjt: 200,
    keepUpright: true,
    confirmed: true
}

export const order1 = {
  customerName: faker.person.fullName(),
  status: OrderSetting.auto_accept,
  customerNotes: faker.lorem.paragraph(2),
  courierNotes: faker.lorem.paragraph(2),
  pickupCoords: createPoint(
    faker.location.longitude(),
    faker.location.latitude()
  ),
  dropoffCoords: createPoint(
    faker.location.longitude(),
    faker.location.latitude()
  ),
  items: [item1, item2],
  undeliverableAction: faker.lorem.word(),
  undeliverableReason: faker.lorem.paragraph(1),
  imageType: null,
  imageName: null,
  imageData: null,
  currencyCode: faker.finance.currencyCode(),
  grossRevenue: faker.finance.amount(),
  fees: faker.finance.amount(),
  pay: faker.finance.amount(),
  tips: faker.finance.amount(),
  deliveryTime: faker.date.recent(),
};

export type Item = {
  name: string;
  quantity: number;
  size: "small" | "medium" | "large";
  price: number;
  length: number;
  width: number;
  height: number;
  weight: number;
  keepUpright: boolean;
  confirmed: boolean;
};
