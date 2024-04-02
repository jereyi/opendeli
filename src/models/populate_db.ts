import { createPoint } from "../../test/unit/utils/helper";
import Merchant from "./merchant.model";
import Location from "./location.model";
import Order from "./order.model";
import { DeliveryType, OrderStatus, PickupType } from "../utils/enum.util";
import { Item } from "../utils/types.util";
import Courier from "./courier.model";
import bcrypt from "bcrypt";

async function populate() {
  const courier = await Courier.create({
    firstName: "Jessie",
    lastName: "Ereyi",
    email: "jereyi@princeton.edu",
    phoneNumber: "9804417895",
    password: await bcrypt.hash("J0e7s2s7e!", 10),
  });
  courier.createSetting();
  const merchant = await Merchant.create({
    name: "Hoagie Haven",
    phoneNumber: "6099217723",
  });
  const dropoffLocation = await Location.create({
    addressLine1: "100 Albert Way",
    addressLine2: "Princeton, NJ 08542, United States of America",
    city: "Princeton",
    state: "New Jersey",
    street: "Albert Way",
    houseNumber: "100",
    longitude: -74.66144382105323,
    latitude: 40.35686595970042,
    postCode: "08542",
    stateCode: "NJ",
    countryCode: "US",
    formattedAddress:
      "100 Albert Way, Princeton, NJ 08542, United States of America",
  });
  const pickupLocation = await Location.create({
    addressLine1: "242 Nassau Street",
    addressLine2: "Princeton, NJ 08542, United States of America",
    city: "Princeton",
    state: "New Jersey",
    street: "Nassau Street",
    houseNumber: "244",
    longitude: -74.66144382105323,
    latitude: 40.35686595970042,
    postCode: "08540",
    stateCode: "NJ",
    countryCode: "US",
    formattedAddress:
      "244 Nassau Street, Princeton, NJ 08540, United States of America",
  });
  courier.createComment({
    text: "No parking around Hoagie Haven",
    commentableType: "merchant",
    commentableId: merchant.id,
  });

  courier.createComment({
    text: "Use the code 123456 to get into the building",
    commentableType: "location",
    commentableId: dropoffLocation.id,
  });
  const sandwich: Item = {
    name: "SANCHEZ",
    quantity: 1,
    size: "small",
    price: 16,
  };
  const order = await Order.create({
    customerName: "Jane Doe",
    status: OrderStatus.created,
    customerNotes: ["Do not ring the door bell"],
    customerPhoneNumber: "9804417895",
    courierNotes: [],
    items: [sandwich],
    currencyCode: "USD",
    totalCharge: 23.32,
    fees: 1.5,
    pay: 4.5,
    tips: 1.32,
    totalCompensation: 5.82,
    deliveryTypes: [DeliveryType.MeetAtDoor, DeliveryType.CallOnArrival],
    pickupTypes: [PickupType.DontOpenBags],
  });
  await order.setMerchant(merchant);
  await order.setLocations([pickupLocation, dropoffLocation]);
  console.log("Order created successfully", order);
}

populate();
