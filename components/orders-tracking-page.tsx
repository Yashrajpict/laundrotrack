"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { OrderForm } from "@/components/order-form";
import { laundries, seededOrders } from "@/lib/data";

export function OrdersTrackingPage() {
  const searchParams = useSearchParams();
  const initialLaundryId = searchParams.get("laundry") ?? laundries[1]?.id ?? laundries[0]?.id ?? "";
  const [selectedLaundryId, setSelectedLaundryId] = useState(initialLaundryId);
  const selectedLaundry = useMemo(
    () => laundries.find((entry) => entry.id === selectedLaundryId) ?? laundries[1] ?? laundries[0],
    [selectedLaundryId]
  );
  const trackedOrder = seededOrders[0];

  return (
    <div className="page-shell">
      <section className="dashboard-grid">
        <div className="panel span-7">
          <div className="eyebrow">Orders + Tracking</div>
          <h1>Place laundry orders and follow every live status update in one tab.</h1>
          <p>
            This dedicated module keeps pickup booking, clothing-wise rupee pricing, and live order tracking in
            one focused experience for student users.
          </p>
          <div className="stat-grid">
            <div className="stat">
              <strong>{trackedOrder.id}</strong>
              Active tracked order
            </div>
            <div className="stat">
              <strong>{trackedOrder.predictedTurnaroundHours} hrs</strong>
              Predicted turnaround
            </div>
            <div className="stat">
              <strong>{selectedLaundry.name}</strong>
              Current selected laundry
            </div>
          </div>
        </div>
        <div className="card span-5">
          <h3>Tracking Summary</h3>
          <label className="field">
            <span>Select Laundry For Order</span>
            <select value={selectedLaundryId} onChange={(event) => setSelectedLaundryId(event.target.value)}>
              {laundries.map((laundry) => (
                <option key={laundry.id} value={laundry.id}>
                  {laundry.name} | {laundry.isOpen ? "Open" : "Closed"}
                </option>
              ))}
            </select>
          </label>
          <div className="price-list">
            <div className="price-row">
              <span>Customer</span>
              <strong>{trackedOrder.customerName}</strong>
            </div>
            <div className="price-row">
              <span>Hostel</span>
              <strong>{trackedOrder.hostel}</strong>
            </div>
            <div className="price-row">
              <span>Pickup Slot</span>
              <strong>{trackedOrder.pickupSlot}</strong>
            </div>
            <div className="price-row">
              <span>Total Status Steps</span>
              <strong>{trackedOrder.status.length}</strong>
            </div>
            <div className="price-row">
              <span>Laundry Availability</span>
              <strong>{selectedLaundry.isOpen ? "Open" : "Closed"}</strong>
            </div>
            <div className="price-row">
              <span>Operating Hours</span>
              <strong>{selectedLaundry.operatingHours}</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="section-heading">
        <div className="eyebrow">Live Updates</div>
        <h2>Track laundry progress like a food-delivery timeline.</h2>
      </div>
      <section className="order-layout">
        <div className="span-7">
          <div className="card">
            <h3>Live Status Tracking</h3>
            <p className="muted">
              Owner-generated notifications appear here so students can monitor pickup, wash, pressing, and
              delivery progress in real time.
            </p>
            <div className="status-list">
              {trackedOrder.status.map((entry) => (
                <div className="status-item" key={`${entry.stage}-${entry.timestamp}`}>
                  <span>
                    <span className="timeline-badge">{entry.timestamp}</span>
                    <h4>{entry.stage}</h4>
                    <p className="muted">{entry.detail}</p>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <OrderForm laundry={selectedLaundry} />
      </section>
    </div>
  );
}
