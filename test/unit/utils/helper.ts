import { Point, Polygon } from "geojson";
import Order from "../../../src/models/order.model";
import { expect } from "vitest";
import Merchant from "../../../src/models/merchant.model";
import Location from "../../../src/models/location.model";
import Comment from "../../../src/models/comment.model";
import Courier from "../../../src/models/courier.model";
import bcrypt from "bcrypt";
import {
  location1 as place1,
  location2 as place2,
  location3 as place3,
  location4 as place4,
  order1,
  order2,
  order3,
  person1,
  person2,
  person3,
  comment1 as note1,
  comment2 as note2,
  comment3 as note3,
  merchant1 as store1,
  order4,
  order5,
} from "./testData";
import Setting from "../../../src/models/setting.model";
import { LocationType } from "../../../src/utils/enum.util";

export function createPoint(longitude: number, latitude: number) {
  return {
    type: "Point",
    coordinates: [longitude, latitude],
  } as Point;
}

export function createPolygon(coordinates: number[][]) {
  return {
    type: "Polygon",
    coordinates: [coordinates],
  } as Polygon;
}

export const checkOrders = (o1: Order, o2: Order) => {
  expect(o1.id).eql(o2.id);
  expect(o1.CourierId).eql(o2.CourierId);
  expect(o1.courierNotes).eql(o2.courierNotes);
  expect(o1.currencyCode).eql(o2.currencyCode);
  expect(o1.customerNotes).eql(o2.customerNotes);
  expect(o1.customerPhoneNumber).eql(o2.customerPhoneNumber);

  expect(o1.deliveryTypes).eql(o2.deliveryTypes);
  expect(o1.deliveryTime).eql(o2.deliveryTime.toJSON());
  expect(o1.fees).eql(o2.fees);

  expect(o1.imageData).eql(o2.imageData);

  expect(o1.imageName).eql(o2.imageName);

  expect(o1.imageType).eql(o2.imageType);

  expect(o1.items).eql(o2.items);

  expect(o1.pay).eql(o2.pay);

  expect(o1.pickupTypes).eql(o2.pickupTypes);

  expect(o1.status).eql(o2.status);

  expect(o1.tips).eql(o2.tips);

  expect(o1.totalCharge).eql(o2.totalCharge);

  expect(o1.totalCompensation).eql(o2.totalCompensation);

  expect(o1.undeliverableAction).eql(o2.undeliverableAction);

  expect(o1.undeliverableReason).eql(o2.undeliverableReason);
};

export const checkLocations = (l1: Location, l2: Location) => {
  expect(l1.id).eql(l2.id);
  expect(l1.addressLine1).eql(l2.addressLine1);
  expect(l1.addressLine2).eql(l2.addressLine2);
  expect(l1.city).eql(l2.city);
  expect(l1.countryCode).eql(l2.countryCode);
  expect(l1.formattedAddress).eql(l2.formattedAddress);
  expect(l1.houseNumber).eql(l2.houseNumber);
  expect(l1.latitude).eql(l2.latitude);
  expect(l1.longitude).eql(l2.longitude);
  expect(l1.postCode).eql(l2.postCode);
  expect(l1.state).eql(l2.state);
  expect(l1.street).eql(l2.street);
  expect(l1.stateCode).eql(l2.stateCode);
};

export const checkMerchants = (m1: Merchant, m2: Merchant) => {
  expect(m1.id).eql(m2.id);
  expect(m1.logo).eql(m2.logo);
  expect(m1.phoneNumber).eql(m2.phoneNumber);
  expect(m1.name).eql(m2.name);
};

export const checkComments = (c1: Comment, c2: Comment) => {
  expect(c1.id).eql(c2.id);
  expect(c1.commentableId).eql(c2.commentableId);
  expect(c1.commentableType).eql(c2.commentableType);
  expect(c1.likes).eql(c2.likes);
  expect(c1.text).eql(c2.text);
  expect(c1.likers).eql(c2.likers);
};

export const populateDB = async () => {
  const courier1 = await Courier.create({
    ...person1,
    password: await bcrypt.hash(person1.password, 10),
  });
  const courier2 = await Courier.create({
    ...person2,
    password: await bcrypt.hash(person2.password, 10),
  });
  const courier3 = await Courier.create({
    ...person3,
    password: await bcrypt.hash(person3.password, 10),
  });

  const setting1 = await courier1.createSetting();

  const merchant1 = await Merchant.create(store1);
  const location1 = await Location.create(place1);
  const location2 = await Location.create(place2);
  const location3 = await Location.create(place3);
  const location4 = await Location.create(place4);
  const comment1 = await Comment.create({
    ...note1,
    CourierId: courier1.id,
    commentableId: merchant1.id,
    commentableType: "merchant",
  });
  const comment2 = await Comment.create({
    ...note2,
    CourierId: courier1.id,
    commentableId: location2.id,
    commentableType: "location",
  });
  const comment3 = await Comment.create({
    ...note3,
    CourierId: courier2.id,
    commentableId: location3.id,
    commentableType: "location",
  });
  const inprogressDelivery1 = await Order.create({
    ...order1,
    CourierId: courier1.id,
  });
  await inprogressDelivery1.addLocation(location1, {
    through: { locationType: LocationType.pickup },
  });
  await inprogressDelivery1.addLocation(location2, {
    through: { locationType: LocationType.dropoff },
  });
  await inprogressDelivery1.setMerchant(merchant1);
  const inprogressDelivery2 = await Order.create({
    ...order4,
    CourierId: courier1.id,
  });
  await inprogressDelivery2.addLocation(location1, {
    through: { locationType: LocationType.pickup },
  });
  await inprogressDelivery2.addLocation(location2, {
    through: { locationType: LocationType.dropoff },
  });
  await inprogressDelivery2.setMerchant(merchant1);
  const completedDelivery1 = await Order.create({
    ...order5,
    CourierId: courier1.id,
  });
  await completedDelivery1.addLocation(location1, {
    through: { locationType: LocationType.pickup },
  });
  await completedDelivery1.addLocation(location4, {
    through: { locationType: LocationType.dropoff },
  });
  await completedDelivery1.setMerchant(merchant1);
  const offer2 = await Order.create({ ...order2, CourierId: courier1.id });
  await offer2.addLocation(location1, {
    through: { locationType: LocationType.pickup },
  });
  await offer2.addLocation(location3, {
    through: { locationType: LocationType.dropoff },
  });
  await offer2.setMerchant(merchant1);
  const offer3 = await Order.create(order3);
  await offer3.addLocation(location1, {
    through: { locationType: LocationType.pickup },
  });
  await offer3.addLocation(location3, {
    through: { locationType: LocationType.dropoff },
  });
  await offer3.setMerchant(merchant1);
  return {
    courier1,
    courier2,
    courier3,
    merchant1,
    setting1,
    location1,
    location2,
    location3,
    location4,
    comment1,
    comment2,
    comment3,
    inprogressDelivery1,
    inprogressDelivery2,
    completedDelivery1,
    offer2,
    offer3,
  };
};

export const calculateDistance = (p1: Point, p2: Point) => {
  return Math.sqrt(
    Math.pow(p1.coordinates[0] - p2.coordinates[0], 2) +
      Math.pow(p1.coordinates[1] - p2.coordinates[1], 2)
  );
}