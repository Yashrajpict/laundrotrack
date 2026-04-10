"use client";

import { useEffect, useMemo, useState } from "react";
import { getCurrentAccount } from "@/lib/auth";
import { laundries, seededOrders } from "@/lib/data";
import { buildInsight } from "@/lib/ml";

export function OwnerDashboard() {
  const [selectedLaundryId, setSelectedLaundryId] = useState("laundry-2");
  const [queueLoad, setQueueLoad] = useState(15);
  const [positionNote, setPositionNote] = useState("Pickup van stops outside Girls Hostel every evening");
  const [latitude, setLatitude] = useState("30.7417");
  const [longitude, setLongitude] = useState("76.7683");
  const [statusMessage, setStatusMessage] = useState("Your batch is in steam press and will be dispatched soon.");
  const [ownerAccount, setOwnerAccount] = useState<{
    name: string;
    email: string;
    laundryName: string;
    address: string;
  }>({
    name: "Meera Nair",
    email: "owner@freshloop.in",
    laundryName: "FreshLoop Laundry",
    address: "Hostel Square, Sector 14, Chandigarh"
  });

  const laundry = useMemo(
    () => laundries.find((entry) => entry.id === selectedLaundryId) ?? laundries[1],
    [selectedLaundryId]
  );
  const insight = buildInsight(selectedLaundryId, { liveQueueLoad: queueLoad });

  useEffect(() => {
    const currentAccount = getCurrentAccount();
    if (currentAccount?.role === "owner") {
      setOwnerAccount({
        name: currentAccount.name,
        email: currentAccount.email,
        laundryName: currentAccount.laundryName,
        address: currentAccount.address
      });
    }
  }, []);

  return (
    <div className="page-shell">
      <section className="dashboard-grid">
        <div className="panel span-7">
          <div className="eyebrow">Laundry Owner Console</div>
          <h1>Manage queue pressure, map location, and live customer updates.</h1>
          <p>
            Owners get a dedicated login and profile area to update predicted rush hours, shift their map
            position, and push live order statuses directly to student users.
          </p>
          <div className="stat-grid">
            <div className="stat">
              <strong>{queueLoad}</strong>
              Live queue load
            </div>
            <div className="stat">
              <strong>{insight?.busiestDay}</strong>
              Peak day predicted by model
            </div>
            <div className="stat">
              <strong>{latitude}</strong>
              Current latitude
            </div>
          </div>
        </div>
        <div className="card span-5">
          <h3>Owner Profile</h3>
          <div className="profile-grid">
            <div className="span-12 profile-row">
              <span>Owner</span>
              <strong>{ownerAccount.name}</strong>
            </div>
            <div className="span-12 profile-row">
              <span>Laundry</span>
              <strong>{ownerAccount.laundryName}</strong>
            </div>
            <div className="span-12 profile-row">
              <span>Email</span>
              <strong>{ownerAccount.email}</strong>
            </div>
            <div className="span-12 profile-row">
              <span>Address</span>
              <strong>{ownerAccount.address}</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="section-heading">
        <div className="eyebrow">Owner Controls</div>
        <h2>Update rush hours and map position for your laundry.</h2>
      </div>
      <section className="dashboard-grid">
        <div className="card span-6">
          <h3>Rush-Hour Update Panel</h3>
          <div className="form-grid">
            <label className="field">
              <span>Manage Laundry</span>
              <select value={selectedLaundryId} onChange={(event) => setSelectedLaundryId(event.target.value)}>
                {laundries.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Live Queue Load</span>
              <input
                type="number"
                value={queueLoad}
                onChange={(event) => setQueueLoad(Number(event.target.value))}
              />
            </label>
            <label className="field">
              <span>Position Note</span>
              <input value={positionNote} onChange={(event) => setPositionNote(event.target.value)} />
            </label>
            <button className="primary" type="button">
              Save Rush Update
            </button>
          </div>
        </div>

        <div className="card span-6">
          <h3>Map Position Update</h3>
          <div className="form-grid">
            <label className="field">
              <span>Latitude</span>
              <input value={latitude} onChange={(event) => setLatitude(event.target.value)} />
            </label>
            <label className="field">
              <span>Longitude</span>
              <input value={longitude} onChange={(event) => setLongitude(event.target.value)} />
            </label>
            <label className="field">
              <span>Landmark for Students</span>
              <input value={positionNote} onChange={(event) => setPositionNote(event.target.value)} />
            </label>
            <button className="secondary" type="button">
              Update Map Pin
            </button>
          </div>
        </div>
      </section>

      <div className="section-heading">
        <div className="eyebrow">Notification Hub</div>
        <h2>Push live laundry status updates to users.</h2>
      </div>
      <section className="dashboard-grid">
        <div className="card span-7">
          <h3>Send Live Update</h3>
          <div className="form-grid">
            <label className="field">
              <span>Order</span>
              <select defaultValue={seededOrders[0].id}>
                {seededOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.id} - {order.customerName}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Status Message</span>
              <input value={statusMessage} onChange={(event) => setStatusMessage(event.target.value)} />
            </label>
            <button className="primary" type="button">
              Notify Student
            </button>
          </div>
        </div>

        <div className="card span-5">
          <h3>Current Recommendation</h3>
          <div className="price-list">
            <div className="price-row">
              <span>Busiest day</span>
              <strong>{insight?.busiestDay}</strong>
            </div>
            <div className="price-row">
              <span>Calmest day</span>
              <strong>{insight?.calmestDay}</strong>
            </div>
            <div className="price-row">
              <span>Best pickup window</span>
              <strong>{insight?.bestPickupWindow}</strong>
            </div>
          </div>
          <p className="mini-note">
            Adjust queue load and position data to refresh this operational guidance for your customers.
          </p>
        </div>
      </section>
    </div>
  );
}
