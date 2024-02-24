export type ShiftAvailability = {
  sunday: Date[][];
  monday: Date[][];
  tuesday: Date[][];
  wednesday: Date[][];
  thursday: Date[][];
  friday: Date[][];
  saturday: Date[][];
};

export type EarningGoals = {
  daily: number;
  weekly: number;
};

export type PayRate = {
  hourlyDate: number;
  perDeliveryRate: number;
  distanceBasedRate: number;
  surgePricingPreference: number;
  minimumEarningsGuarantee: number;
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
};

export type Point = {
  type: "Point";
  coordinates: [number, number];
}