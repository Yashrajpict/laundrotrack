"use client";

import { useMemo, useState } from "react";
import { GoogleMap } from "@/components/google-map";
import Link from "next/link";
import { laundries } from "@/lib/data";
import { buildAllInsights } from "@/lib/ml";
import { formatCurrency } from "@/lib/utils";

export function StudentDashboard() {
  const [selectedLaundryId, setSelectedLaundryId] = useState(laundries[1]?.id ?? laundries[0]?.id ?? "");
  const selectedLaundry = useMemo(
    () => laundries.find((entry) => entry.id === selectedLaundryId) ?? laundries[0],
    [selectedLaundryId]
  );
  const insight = buildAllInsights().find((entry) => entry.laundryId === selectedLaundry.id);

  return (
    <div className="page-shell">
      <section className="dashboard-grid">
        <div className="panel span-7">
          <div className="eyebrow">Student Experience</div>
          <h1>Book laundry around campus with ML-based turnaround forecasts.</h1>
          <p>
            LaundroTrack helps college students and hostelites discover nearby laundries, compare live queues,
            and place clothing-wise orders with real-time delivery status updates similar to Swiggy or Zomato.
          </p>
          <div className="stat-grid">
            <div className="stat">
              <strong>{selectedLaundry.distanceKm} km</strong>
              Closest laundry to your hostel
            </div>
            <div className="stat">
              <strong>{insight?.calmestDay}</strong>
              Lowest expected wait this week
            </div>
            <div className="stat">
              <strong>{selectedLaundry.etaMinutes} min</strong>
              Average pickup ETA
            </div>
          </div>
        </div>
        <div className="card span-5">
          <h3>User Profile</h3>
          <div className="profile-grid">
            <div className="span-12 profile-row">
              <span>Name</span>
              <strong>Aarav Sharma</strong>
            </div>
            <div className="span-12 profile-row">
              <span>Email</span>
              <strong>student@laundrotrack.in</strong>
            </div>
            <div className="span-12 profile-row">
              <span>Hostel</span>
              <strong>Block C Hostel</strong>
            </div>
            <div className="span-12 profile-row">
              <span>Preferred Laundry</span>
              <strong>{selectedLaundry.name}</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="section-heading">
        <div className="eyebrow">Map + Discovery</div>
        <h2>Nearby laundries with clickable pins and pop-up details.</h2>
      </div>
      <section className="dashboard-grid">
        <div className="span-8">
          <GoogleMap
            laundries={laundries}
            selectedLaundryId={selectedLaundry.id}
            onSelectLaundry={setSelectedLaundryId}
          />
        </div>
        <div className="card span-4">
          <h3>{selectedLaundry.name}</h3>
          <p className="muted">{selectedLaundry.address}</p>
          <div className="pill-row">
            <div className="pill">{selectedLaundry.rating} rating</div>
            <div className="pill">{selectedLaundry.distanceKm} km away</div>
            <div className="pill">{selectedLaundry.etaMinutes} min ETA</div>
          </div>
          <p className="mini-note">{selectedLaundry.positionNote}</p>
          <p className="mini-note">
            Status: <strong>{selectedLaundry.isOpen ? "Open now" : "Closed now"}</strong> |{" "}
            {selectedLaundry.operatingHours}
          </p>
          <h4>Service Menu</h4>
          <div className="price-list">
            {selectedLaundry.services.map((service) => (
              <div className="price-row" key={service.item}>
                <span>{service.item}</span>
                <strong>{formatCurrency(service.priceInr)}</strong>
              </div>
            ))}
          </div>
          <Link className="button primary" href={`/orders?laundry=${selectedLaundry.id}`}>
            Select This Laundry For Orders
          </Link>
        </div>
      </section>

      <div className="section-heading">
        <div className="eyebrow">AI + ML Insights</div>
        <h2>Rush-hour analysis and best-day recommendations.</h2>
      </div>
      <section className="insight-grid">
        <div className="card span-4">
          <h3>Most Time Required</h3>
          <strong>{insight?.busiestDay}</strong>
          <p className="muted">
            Expected to take the longest because predicted order load and current queue are both high.
          </p>
        </div>
        <div className="card span-4">
          <h3>Least Time Required</h3>
          <strong>{insight?.calmestDay}</strong>
          <p className="muted">
            Best option for quick turnaround if you want your clothes back faster this week.
          </p>
        </div>
        <div className="card span-4">
          <h3>Best Pickup Window</h3>
          <strong>{insight?.bestPickupWindow}</strong>
          <p className="muted">Recommended by the forecast model using weekly demand patterns.</p>
        </div>
        <div className="card span-7">
          <h3>Predicted Weekly Turnaround</h3>
          <div className="status-list">
            {insight?.rushWindows.map((window) => (
              <div className="status-item" key={window.day}>
                <span>
                  <strong>{window.day}</strong>
                  <br />
                  <span className="muted">{window.predictedOrders} predicted loads</span>
                </span>
                <strong>{window.estimatedTurnaroundHours} hrs</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="card span-5">
          <h3>Model Used</h3>
          <ul className="list">
            {insight?.modelNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="card span-12">
          <Link className="button primary" href="/orders">
            Go to Orders + Tracking
          </Link>
        </div>
      </section>
    </div>
  );
}
