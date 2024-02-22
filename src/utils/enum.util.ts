// COURIER MODEL
export enum OrderSetting {
  AutoAccept,
  AutoReject,
  Manual,
}

// SETTINGS MODEL
export enum VehicleType {
  Bicycle,
  Motorcycle,
  Car,
  Scooter,
  OnFoot,
}
export enum RestaurantTypes {
  Local,
  Chain,
  BlackOwned,
  WomanOwned,
  Franchise,
  Upscale,
  FastCasual,
  FoodTrucks,
  VeganVegetarian,
}
export enum OrderPreferences {
  SmallOrders,
  MediumOrders,
  LargeOrders,
}
export enum FoodPreferences {
  Hot,
  Cold,
  Fragile,
}

export enum DeliverySpeed {
  Regular,
  Rush,
}

export enum CuisineTypes {
  American,
  Italian,
  Mexican,
  Chinese,
  Japanese,
  Indian,
  Mediterranean,
  Thai,
  French,
  Korean,
  Vietnamese,
  MiddleEastern,
  African,
  Caribbean,
}

export enum DietaryRestrictions {
  Vegan,
  Vegetarian,
  Halal,
  Kosher,
  Organic,
  AlcoholFree,
}

// ORDER MODEL
export enum OrderStatus {
  Created,
  Dispatched,
  PickedUp,
  DroppedOff,
  Canceled,
}
