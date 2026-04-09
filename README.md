<<<<<<< HEAD
# laundrotrack
LaundroTrack is a comprehensive, full-stack laundry management and tracking ecosystem designed to bridge the gap between students and local laundry services. Built with a focus on real-time transparency and convenience, it provides a seamless experience for both service seekers and providers.
=======
# LaundroTrack

LaundroTrack is an AI/ML full-stack laundry application concept for college students, hostelites, and laundry owners.

## What is included

- Student dashboard with nearby laundries, map integration points, order placement, rupee pricing, and profile details
- Laundry owner dashboard with separate login/profile, rush-hour controls, queue management, position updates, and live status notifications
- API routes for laundries, orders, and ML insights
- ML-style rush-hour forecasting using exponentially weighted moving averages plus queue/capacity blending
- Google Maps-ready component that shows marker popups with laundry name and address when an API key is provided

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Optional: add a Google Maps API key in `.env.local`

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

3. Start the app:

```bash
npm run dev
```

## Demo credentials

- Student: `student@laundrotrack.in` / `student123`
- Owner: `owner@freshloop.in` / `owner123`

## ML note

The starter uses an interpretable baseline forecast:

- Exponentially weighted moving average for historical demand trends
- Queue pressure and laundry capacity blending for turnaround-time estimation
- Best-day and worst-day recommendation generation for the UI

This is a good MVP base. For production, you can upgrade to XGBoost, Prophet, or LSTM models using real transaction and pickup data.
>>>>>>> adf9e3e (initial commit)
