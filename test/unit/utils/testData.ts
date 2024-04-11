import { faker } from "@faker-js/faker";
import {
  OrderPreferences,
  OrderSetting,
  OrderStatus,
  UserStatus,
} from "../../../src/utils/enum.util";
import { Point } from "geojson";
import Courier from "../../../src/models/courier.model";
import Order from "../../../src/models/order.model";
import { Item } from "../../../src/utils/types.util";

function createPoint(longitude: number, latitude: number) {
  return {
    type: "Point",
    coordinates: [longitude, latitude],
  } as Point;
}

const createComment = () => ({
  text: faker.lorem.paragraph(2),
  likes: faker.number.int({ min: 0, max: 1000 }),
});

const createMerchant = () => ({
  name: faker.company.name(),
  phoneNumber: faker.phone.number(),
});

const createLocation = () => ({
  addressLine1: faker.location.streetAddress(),
  addressLine2: faker.location.secondaryAddress(),
  city: faker.location.city(),
  state: faker.location.state(),
  street: faker.location.streetAddress(),
  houseNumber: faker.location.buildingNumber(),
  longitude: faker.location.longitude(),
  latitude: faker.location.latitude(),
  postCode: faker.location.zipCode(),
  stateCode: faker.location.state({ abbreviated: true }),
  countryCode: faker.location.countryCode(),
  formattedAddress: faker.location.streetAddress({ useFullAddress: true }),
});

const createItem = (size: OrderPreferences) => ({
  name: faker.commerce.productName(),
  quantity: faker.number.int({ max: 100 }),
  size: size,
  price: parseFloat(faker.commerce.price()),
  length: faker.number.int({ min: 0, max: 100 }),
  width: faker.number.int({ min: 0, max: 100 }),
  height: faker.number.int({ min: 0, max: 100 }),
  weight: faker.number.int({ min: 0, max: 100 }),
  keepUpright: true,
});

const createOrder = (status: OrderStatus, items: any[]) => ({
  customerName: faker.person.fullName(),
  status: status,
  customerNotes: [faker.lorem.paragraph(2)],
  courierNotes: [],
  items: items,
  currencyCode: faker.finance.currencyCode(),
  totalCharge: parseFloat(faker.finance.amount()),
  totalCompensation: parseFloat(faker.finance.amount()),
  fees: parseFloat(faker.finance.amount()),
  pay: parseFloat(faker.finance.amount()),
  tips: parseFloat(faker.finance.amount()),
  deliveryTime: faker.date.soon(),
});


const createPerson = (status: UserStatus, orderSetting: OrderSetting) => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  phoneNumber: faker.phone.number(),
  status: status,
  orderSetting: orderSetting,
  currentLocation: createPoint(
    faker.location.longitude(),
    faker.location.latitude()
  ),
});

export const person1 = createPerson(UserStatus.last_call, OrderSetting.auto_accept);
export const person2 = createPerson(UserStatus.offline, OrderSetting.auto_reject);
export const person3 = createPerson(UserStatus.online, OrderSetting.auto_accept);

const item1: Item = createItem(OrderPreferences.medium_orders);
const item2: Item = createItem(OrderPreferences.small_orders);
const item3: Item = createItem(OrderPreferences.large_orders);

export const order1 = createOrder(OrderStatus.dispatched, [item1, item2]);
export const order2 = createOrder(OrderStatus.created, [item1]);
export const order3 = createOrder(OrderStatus.created, [item2]);
export const order4 = createOrder(OrderStatus.picked_up, [item1, item2, item3]);
export const order5 = createOrder(OrderStatus.dropped_off, [item3]);

export const merchant1 = createMerchant();

export const location1 = createLocation();
export const location2 = createLocation();
export const location3 = createLocation();
export const location4 = createLocation();

export const comment1 = createComment();
export const comment2 = createComment();
export const comment3 = createComment();
