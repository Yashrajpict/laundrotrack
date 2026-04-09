import { Suspense } from "react";
import { OrdersTrackingPage } from "@/components/orders-tracking-page";

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersTrackingPage />
    </Suspense>
  );
}
