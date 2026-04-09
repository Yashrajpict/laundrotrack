export type UserRole = "student" | "owner";

export type Laundry = {
  id: string;
  name: string;
  address: string;
  ownerName: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  rating: number;
  etaMinutes: number;
  positionNote: string;
  services: {
    item: string;
    priceInr: number;
  }[];
  weeklyDemand: number[];
  capacityPerHour: number;
  liveQueueLoad: number;
  isOpen: boolean;
  queueEnabled: boolean;
  operatingHours: string;
};

export type OrderItem = {
  item: string;
  quantity: number;
  unitPriceInr: number;
};

export type StatusUpdate = {
  stage: string;
  timestamp: string;
  detail: string;
};

export type Order = {
  id: string;
  laundryId: string;
  customerName: string;
  hostel: string;
  pickupSlot: string;
  items: OrderItem[];
  totalInr: number;
  predictedTurnaroundHours: number;
  status: StatusUpdate[];
};

export type Insight = {
  laundryId: string;
  busiestDay: string;
  calmestDay: string;
  bestPickupWindow: string;
  rushWindows: {
    day: string;
    predictedOrders: number;
    estimatedTurnaroundHours: number;
  }[];
  modelNotes: string[];
};
