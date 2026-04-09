import Link from "next/link";
import { laundries } from "@/lib/data";
import { buildAllInsights } from "@/lib/ml";

export default function HomePage() {
  const insights = buildAllInsights();

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="panel">
          <h1>LaundroTrack makes hostel laundry discoverable, predictable, and trackable.</h1>
          <p>
            Built for college students and laundry owners, LaundroTrack combines Google Maps discovery, machine
            learning based rush-hour forecasting, live order tracking, dual-role logins, and clothing-wise
            pricing in rupees.
          </p>
          <div className="cta-row">
            <Link className="button primary" href="/student">
              Explore Student App
            </Link>
            <Link className="button secondary" href="/owner">
              Open Owner Console
            </Link>
            <Link className="button secondary" href="/orders">
              Open Orders Tab
            </Link>
          </div>
          <div className="stat-grid">
            <div className="stat">
              <strong>{laundries.length}</strong>
              Seed laundries on the map
            </div>
            <div className="stat">
              <strong>{insights[0]?.busiestDay}</strong>
              Example peak day prediction
            </div>
            <div className="stat">
              <strong>Live</strong>
              Status updates like Swiggy/Zomato
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
