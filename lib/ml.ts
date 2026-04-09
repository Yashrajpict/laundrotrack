import { laundries } from "@/lib/data";
import { Insight, Laundry } from "@/lib/types";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

function exponentialSmoothing(values: number[], alpha = 0.45) {
  return values.reduce((accumulator, value, index) => {
    if (index === 0) {
      return value;
    }
    return alpha * value + (1 - alpha) * accumulator;
  }, values[0] ?? 0);
}

function normalizeDemand(laundry: Laundry, demand: number) {
  return demand / Math.max(laundry.capacityPerHour * 4, 1);
}

function estimatedTurnaroundHours(laundry: Laundry, demand: number) {
  const smoothedDemand = exponentialSmoothing(laundry.weeklyDemand);
  const demandPressure = normalizeDemand(laundry, demand);
  const queuePressure = laundry.liveQueueLoad / Math.max(laundry.capacityPerHour, 1);
  const blendedScore = smoothedDemand * 0.08 + demandPressure * 9 + queuePressure * 4;
  return Number(Math.max(7, blendedScore).toFixed(1));
}

type InsightOverrides = {
  liveQueueLoad?: number;
};

export function buildInsight(laundryId: string, overrides?: InsightOverrides): Insight | undefined {
  const laundry = laundries.find((entry) => entry.id === laundryId);
  if (!laundry) {
    return undefined;
  }

  const evaluatedLaundry: Laundry = {
    ...laundry,
    liveQueueLoad: overrides?.liveQueueLoad ?? laundry.liveQueueLoad
  };

  const rushWindows = evaluatedLaundry.weeklyDemand.map((demand, index) => ({
    day: days[index],
    predictedOrders: Math.round(exponentialSmoothing([demand, evaluatedLaundry.liveQueueLoad + demand * 0.2])),
    estimatedTurnaroundHours: estimatedTurnaroundHours(evaluatedLaundry, demand)
  }));

  const busiest = [...rushWindows].sort(
    (left, right) => right.estimatedTurnaroundHours - left.estimatedTurnaroundHours
  )[0];
  const calmest = [...rushWindows].sort(
    (left, right) => left.estimatedTurnaroundHours - right.estimatedTurnaroundHours
  )[0];

  return {
    laundryId,
    busiestDay: busiest.day,
    calmestDay: calmest.day,
    bestPickupWindow: `${calmest.day}, 11:00 AM - 2:00 PM`,
    rushWindows,
    modelNotes: [
      "Demand is forecast using exponentially weighted moving averages on historical daily loads.",
      "Turnaround time blends predicted orders, live queue load, and hourly laundry capacity.",
      "Owner-updated queue changes can shift the best pickup day in real time."
    ]
  };
}

export function buildAllInsights() {
  return laundries
    .map((laundry) => buildInsight(laundry.id))
    .filter((entry): entry is Insight => Boolean(entry));
}
