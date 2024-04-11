// COURIER MODEL
export enum OrderSetting {
  auto_accept = "auto_accept",
  auto_reject = "auto_reject",
  manual = "manual",
}
export enum UserStatus {
  online = "online",
  offline = "offline",
  last_call = "last_call",
}

// SETTINGS MODEL
export enum VehicleType {
  bicycle = "bicycle",
  motorcycle = "motorcycle",
  car = "car",
  scooter = "scooter",
  on_foot = "on_foot",
}
export enum RestaurantTypes {
  local = "local",
  chain = "chain",
  black_owned = "black_owned",
  women_owned = "women_owned",
  franchise = "franchise",
  upscale = 'upscale',
  fast_casual = "fast_casual",
  food_trucks = "food_trucks",
  vegan_vegetarian = "vegan_vegetarian",
}
export enum OrderPreferences {
  small_orders = "small_orders",
  medium_orders = "medium_orders",
  large_orders = "large_orders",
}
export enum FoodPreferences {
  hot = "hot",
  cold = "cold",
  fragile = "fragile",
}

export enum DeliverySpeed {
  regular = "regular",
  rush = "rush",
}

export enum CuisineTypes {
  american = "american",
  italian = "italian",
  mexican = "mexican",
  chinese = "chinese",
  japanese = "japanese",
  indian = "indian",
  mediterranean = "mediterranean",
  thai = "thai",
  french = "french",
  korean = "korean",
  vietnamese = "vietnamese",
  middle_eastern = "middle_eastern",
  african = "african",
  carribean = "caribbean",
}

export enum DietaryRestrictions {
  vegan = "vegan",
  vegetarian = "vegetarian",
  halal = "halal",
  kosher = "kosher",
  organic = "organic",
  alcohol_free = "alcohol_free",
}

// ORDER MODEL
export enum OrderStatus {
  created = "created",
  dispatched = "dispatched",
  picked_up = "picked_up",
  dropped_off = "dropped_off",
  canceled = "canceled",
}

export enum DeliveryType {
  LeaveAtDoor = "leave_at_door",
  MeetOutside = "meet_outside",
  MeetInside = "meet_inside",
  MeetAtDoor = "meet_at_door",
  CallOnArrival = "call_on_arrival",
}

export enum PickupType {
  LineupThirdPartyPickup = "line_up_pickup",
  ParkThirdPartyLot = "park_in_lot",
  DontOpenBags = `dont_open_bags`,
  CallOnArrival = "call_on_arrival",
}

// ORDERLOCATION MODEL
export enum LocationType {
  pickup = "pickup",
  dropoff = "dropoff",
  return = "return",
}
