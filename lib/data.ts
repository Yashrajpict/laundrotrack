import { Laundry, Order } from "@/lib/types";

export const demoAccounts = {
  student: {
    email: "student@laundrotrack.in",
    password: "student123",
    name: "Aarav Sharma",
    hostel: "Block C Hostel"
  },
  owner: {
    email: "owner@freshloop.in",
    password: "owner123",
    name: "Meera Nair",
    laundryId: "laundry-2"
  }
};

export const laundries: Laundry[] = [
  {
    id: "laundry-1",
    name: "Campus Clean Co.",
    address: "Gate 2 Market, North Campus, Delhi",
    ownerName: "Rohan Verma",
    latitude: 28.6872,
    longitude: 77.211,
    distanceKm: 0.8,
    rating: 4.6,
    etaMinutes: 35,
    positionNote: "Closest to Boys Hostel lane",
    services: [
      { item: "Shirt", priceInr: 25 },
      { item: "T-shirt", priceInr: 20 },
      { item: "Jeans", priceInr: 45 },
      { item: "Bedsheet", priceInr: 70 }
    ],
    weeklyDemand: [48, 54, 67, 70, 92, 110, 84],
    capacityPerHour: 24,
    liveQueueLoad: 19,
    isOpen: true,
    queueEnabled: true,
    operatingHours: "8:00 AM - 10:00 PM"
  },
  {
    id: "laundry-2",
    name: "FreshLoop Laundry",
    address: "Hostel Square, Sector 14, Chandigarh",
    ownerName: "Meera Nair",
    latitude: 30.7417,
    longitude: 76.7683,
    distanceKm: 1.3,
    rating: 4.8,
    etaMinutes: 28,
    positionNote: "Pickup van stops outside Girls Hostel every evening",
    services: [
      { item: "Shirt", priceInr: 28 },
      { item: "Hoodie", priceInr: 60 },
      { item: "Jeans", priceInr: 48 },
      { item: "Blanket", priceInr: 120 }
    ],
    weeklyDemand: [42, 45, 55, 63, 86, 104, 79],
    capacityPerHour: 27,
    liveQueueLoad: 15,
    isOpen: false,
    queueEnabled: true,
    operatingHours: "Currently closed, reopens at 7:00 AM"
  },
  {
    id: "laundry-3",
    name: "SpinMate Express",
    address: "Engineering Hostel Road, Pune",
    ownerName: "Aditi Kulkarni",
    latitude: 18.5544,
    longitude: 73.8081,
    distanceKm: 2.1,
    rating: 4.4,
    etaMinutes: 42,
    positionNote: "Near the stationery shop beside Hostel D",
    services: [
      { item: "Kurta", priceInr: 35 },
      { item: "Track Pant", priceInr: 30 },
      { item: "Bedsheet", priceInr: 65 },
      { item: "Jacket", priceInr: 95 }
    ],
    weeklyDemand: [34, 39, 51, 58, 69, 81, 61],
    capacityPerHour: 21,
    liveQueueLoad: 11,
    isOpen: true,
    queueEnabled: true,
    operatingHours: "9:00 AM - 9:30 PM"
  }
];

export const seededOrders: Order[] = [
  {
    id: "ORD-3021",
    laundryId: "laundry-2",
    customerName: "Aarav Sharma",
    hostel: "Block C Hostel",
    pickupSlot: "Today, 7:30 PM",
    items: [
      { item: "Shirt", quantity: 4, unitPriceInr: 28 },
      { item: "Jeans", quantity: 2, unitPriceInr: 48 }
    ],
    totalInr: 208,
    predictedTurnaroundHours: 19,
    status: [
      {
        stage: "Pickup Confirmed",
        timestamp: "6:10 PM",
        detail: "Driver assigned and route locked."
      },
      {
        stage: "Laundry Received",
        timestamp: "8:05 PM",
        detail: "Clothes tagged and sorted by wash care."
      },
      {
        stage: "Wash In Progress",
        timestamp: "9:15 PM",
        detail: "Owner marked machine batch 3 as active."
      },
      {
        stage: "Ready For Delivery",
        timestamp: "Tomorrow, 1:00 PM",
        detail: "Expected after steam press and folding."
      }
    ]
  }
];
