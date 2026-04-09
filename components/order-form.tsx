"use client";

import { useEffect, useMemo, useState } from "react";
import { Laundry, OrderItem } from "@/lib/types";
import { calculateOrderTotal, formatCurrency } from "@/lib/utils";

type Props = {
  laundry: Laundry;
};

export function OrderForm({ laundry }: Props) {
  const [hostel, setHostel] = useState("Block C Hostel");
  const [pickupSlot, setPickupSlot] = useState("Tomorrow, 8:00 AM");
  const [items, setItems] = useState<OrderItem[]>(
    laundry.services.map((service) => ({
      item: service.item,
      quantity: 0,
      unitPriceInr: service.priceInr
    }))
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    setItems(
      laundry.services.map((service) => ({
        item: service.item,
        quantity: 0,
        unitPriceInr: service.priceInr
      }))
    );
    setMessage("");
  }, [laundry]);

  const total = useMemo(() => calculateOrderTotal(items), [items]);
  const totalQuantity = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const predictedHours = useMemo(() => {
    return Math.max(8, Math.round(totalQuantity * 1.6 + laundry.liveQueueLoad * 0.55));
  }, [totalQuantity, laundry.liveQueueLoad]);

  const handleSubmit = () => {
    if (totalQuantity === 0) {
      setMessage("Add at least one clothing item before continuing.");
      return;
    }

    if (laundry.isOpen) {
      setMessage(`Order placed with ${laundry.name}. The owner can now process your pickup request.`);
      return;
    }

    if (laundry.queueEnabled) {
      setMessage(
        `${laundry.name} is currently closed, so your request has been queued for the owner to review when they reopen.`
      );
      return;
    }

    setMessage(`${laundry.name} is closed and not accepting queued orders right now.`);
  };

  return (
    <div className="card span-5">
      <h3>Place Laundry Order</h3>
      <p className="muted">
        Order by clothing type, see per-unit pricing in rupees, and estimate delivery time before placing the
        pickup request.
      </p>
      <p className="mini-note">
        Selected laundry: <strong>{laundry.name}</strong> | {laundry.operatingHours}
      </p>
      <div className="form-grid">
        <label className="field">
          <span>Pickup Hostel</span>
          <input value={hostel} onChange={(event) => setHostel(event.target.value)} />
        </label>
        <label className="field">
          <span>Pickup Slot</span>
          <select value={pickupSlot} onChange={(event) => setPickupSlot(event.target.value)}>
            <option>Today, 7:30 PM</option>
            <option>Tomorrow, 8:00 AM</option>
            <option>Tomorrow, 6:30 PM</option>
          </select>
        </label>
        <div className="service-grid">
          {items.map((item, index) => (
            <div className="service-card" key={item.item}>
              <span>
                <strong>{item.item}</strong>
                <br />
                <span className="muted">{formatCurrency(item.unitPriceInr)} per unit</span>
              </span>
              <input
                min={0}
                type="number"
                value={item.quantity}
                onChange={(event) =>
                  setItems((current) =>
                    current.map((entry, currentIndex) =>
                      currentIndex === index
                        ? { ...entry, quantity: Number(event.target.value) }
                        : entry
                    )
                  )
                }
              />
              <span>{formatCurrency(item.quantity * item.unitPriceInr)}</span>
            </div>
          ))}
        </div>
        <div className="profile-row">
          <span>Total</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
        <div className="profile-row">
          <span>Predicted Delivery Time</span>
          <strong>{predictedHours} hrs</strong>
        </div>
        <div className="profile-row">
          <span>Pickup Route</span>
          <strong>{hostel}</strong>
        </div>
        <button className="primary" onClick={handleSubmit} type="button">
          {laundry.isOpen ? "Confirm Laundry Pickup" : "Queue Order For Owner"}
        </button>
        <p className="mini-note">{message || (laundry.isOpen ? "This laundry is open for direct booking." : "This laundry is closed, but you can queue your order for the owner.")}</p>
      </div>
    </div>
  );
}
