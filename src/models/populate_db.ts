import { createPoint } from "../../test/unit/utils/helper";
import Merchant from "./merchant.model";
import Order from "./order.model";
import { OrderStatus } from "../utils/enum.util";
import { Item } from "../utils/types.util";

async function createOrder() {
  const merchant = await Merchant.create({
    name: "Hoagie Haven",
    phoneNumber: "609-921-7723",
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
    courierNotes: [],
    pickupCoords: createPoint(40.35236470954477, -74.65190830480242),
    dropoffCoords: createPoint(40.35685462275827, -74.66142994548595),
    items: [sandwich],
    currencyCode: "USD",
    grossRevenue: 23.32,
    fees: 1.5,
    pay: 4.5,
    tips: 1.32,
  });
  await order.setMerchant(merchant);
  console.log("Order created successfully", order);
}

createOrder()
