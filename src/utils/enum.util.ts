// COURIER MODEL
export enum OrderSetting {
  "auto_accept",
  "auto_reject",
  "manual",
}

// SETTINGS MODEL
export enum VehicleType {
  "bicycle",
  "motorcycle",
  "car",
  "scooter",
  "on_foot",
}
export enum RestaurantTypes {
  "local",
  "chain",
  "black_owned",
  "women_owned",
  "franchise",
  'upscale',
  "fast_casual",
  "food_trucks",
  "vegan_vegetarian",
}
export enum OrderPreferences {
  "small_orders",
  "medium_orders",
  "large_orders",
}
export enum FoodPreferences {
  "hot",
  "cold",
  "fragile",
}

export enum DeliverySpeed {
  "regular",
  "rush",
}

export enum CuisineTypes {
  "american",
  "italian",
  "mexican",
  "chinese",
  "japanese",
  "indian",
  "mediterranean",
  "thai",
  "french",
  "korean",
  "vietnamese",
  "middle_eastern",
  "african",
  "caribbean",
}

export enum DietaryRestrictions {
  "vegan",
  "vegetarian",
  "halal",
  "kosher",
  "organic",
  "alcohol_free",
}

// ORDER MODEL
export enum OrderStatus {
  "created",
  "dispatched",
  "picked_up",
  "dropped_off",
  "canceled",
}

export enum UserStatus {
  "online",
  "offline",
  "last_call",
}