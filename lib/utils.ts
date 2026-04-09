import { OrderItem } from "@/lib/types";

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function calculateOrderTotal(items: OrderItem[]) {
  return items.reduce((total, item) => total + item.quantity * item.unitPriceInr, 0);
}
