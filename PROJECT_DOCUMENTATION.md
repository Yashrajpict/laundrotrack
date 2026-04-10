# LaundroTrack Project Documentation

## 1. Project Overview

LaundroTrack is a full-stack AI/ML-enabled laundry service application designed for college students, hostelites, and laundry owners. The platform helps student users discover nearby laundries, compare wait times, place clothing-based laundry orders, and monitor live order updates. Laundry owners get a separate dashboard to manage their laundry profile, queue pressure, map positioning, and customer notifications.

The application has been built as a modern Next.js App Router project and includes:

- Role-based login and signup for students and laundry owners
- Google Maps integration for nearby laundry discovery
- Google Places integration to show laundries near the user’s real location
- Machine learning style demand prediction and rush-hour analysis
- A dedicated orders and tracking tab
- Closed-laundry queueing so students can queue requests for the owner to review later
- Demo API routes and seeded application data for local development

This project currently works as an MVP-style prototype with demo data and browser-side persistence for auth.

---

## 2. Core Objective

The main purpose of LaundroTrack is to solve a common student problem: it is difficult to know which laundry is nearby, which one is crowded, how long delivery may take, and what is happening after the clothes are handed over.

LaundroTrack addresses this by combining:

- Location-based discovery using Google Maps and Places
- Predictive analytics to estimate rush hours and turnaround times
- Live status updates inspired by food-delivery apps like Swiggy or Zomato
- Role-based workflows for both the customer and the laundry owner

---

## 3. Technology Stack

### Frontend

- Next.js 15
- React 19
- TypeScript
- App Router architecture
- Custom CSS in [`app/globals.css`](/Users/yashraj/Desktop/LaundroTrack/app/globals.css)

### Backend / Full-Stack Layer

- Next.js API routes
- Shared TypeScript domain models
- Seeded in-memory data for laundries, orders, and ML inputs

### Maps / Location

- Google Maps JavaScript API
- Google Places API
- Browser Geolocation API

### AI / ML Logic

- Exponentially weighted moving average based forecasting
- Queue-pressure and capacity blending for turnaround prediction
- Recommendation logic for busiest day, calmest day, and best pickup window

### Local Persistence

- `localStorage` for signed-up student and owner accounts

---

## 4. Functional Modules

### 4.1 Landing Page

The home page introduces the app and routes users into the student dashboard, owner console, and orders tab.

Relevant file:

- [`app/page.tsx`](/Users/yashraj/Desktop/LaundroTrack/app/page.tsx)

### 4.2 Authentication

The app supports separate signup and login flows for:

- Student users
- Laundry owners

Relevant files:

- [`app/auth/login/page.tsx`](/Users/yashraj/Desktop/LaundroTrack/app/auth/login/page.tsx)
- [`components/login-page-client.tsx`](/Users/yashraj/Desktop/LaundroTrack/components/login-page-client.tsx)
- [`app/auth/signup/page.tsx`](/Users/yashraj/Desktop/LaundroTrack/app/auth/signup/page.tsx)
- [`lib/auth.ts`](/Users/yashraj/Desktop/LaundroTrack/lib/auth.ts)

How it works:

- Demo accounts are always available from seeded data.
- Newly registered users are stored in browser `localStorage`.
- Login validation checks the chosen role, email, and password.
- Role separation is maintained so a student cannot log in through the owner role and vice versa.

### 4.3 Student Dashboard

The student dashboard is the discovery and analytics center for student users.

Relevant file:

- [`components/student-dashboard.tsx`](/Users/yashraj/Desktop/LaundroTrack/components/student-dashboard.tsx)

What it provides:

- Student profile section
- Nearby laundry discovery through map and list
- Clickable map interactions
- Laundry details panel
- Pricing menu in INR
- AI/ML recommendation cards
- A button to select the current laundry for ordering

### 4.4 Orders + Tracking Tab

Ordering and live tracking were separated into their own dedicated page for clarity.

Relevant files:

- [`app/orders/page.tsx`](/Users/yashraj/Desktop/LaundroTrack/app/orders/page.tsx)
- [`components/orders-tracking-page.tsx`](/Users/yashraj/Desktop/LaundroTrack/components/orders-tracking-page.tsx)
- [`components/order-form.tsx`](/Users/yashraj/Desktop/LaundroTrack/components/order-form.tsx)

This page includes:

- Laundry selection dropdown
- Order placement form
- Per-clothing unit pricing in rupees
- Delivery time estimate
- Queue request mode when a laundry is closed
- Tracking summary
- Live order timeline

### 4.5 Laundry Owner Dashboard

Owners use a different dashboard from students.

Relevant file:

- [`components/owner-dashboard.tsx`](/Users/yashraj/Desktop/LaundroTrack/components/owner-dashboard.tsx)

What it includes:

- Owner profile section
- Laundry selection
- Queue load updates
- Position note and coordinate fields
- Message box for sending status updates
- ML recommendation cards to help operational decisions

### 4.6 Maps and Nearby Discovery

Map and nearby-discovery functionality is handled by the Google Maps component.

Relevant file:

- [`components/google-map.tsx`](/Users/yashraj/Desktop/LaundroTrack/components/google-map.tsx)

Current behavior:

- Requests location access from the browser
- Includes a `Use My Location` button
- Loads the Google Maps JavaScript API
- Loads the Places library
- Searches for nearby laundries around the user’s current coordinates
- Creates map pins for nearby Places results
- Shows laundry names and addresses in info popups
- Lists nearby laundries below the map
- Falls back to seeded laundries if nearby Places data is unavailable

---

## 5. User Roles

### Student Role

Student capabilities:

- Sign up as a student
- Log in as a student
- See nearby laundries
- Click laundries on the map
- View laundry details
- Compare estimated turnaround
- Choose a laundry for orders
- Place an order if the laundry is open
- Queue an order if the laundry is closed
- View live order tracking

### Laundry Owner Role

Owner capabilities:

- Sign up as an owner
- Log in as an owner
- Manage laundry profile details
- Update queue load
- Update location notes
- Update coordinates
- Send status messages to users
- Review system recommendations about rush periods

---

## 6. AI / ML Features

LaundroTrack includes a practical ML-inspired module rather than a placeholder banner.

Relevant file:

- [`lib/ml.ts`](/Users/yashraj/Desktop/LaundroTrack/lib/ml.ts)

### 6.1 Forecasting Method

The system uses an interpretable baseline model:

- Historical weekly demand is stored for each laundry
- Exponential smoothing is used to estimate trend strength
- Queue load is blended with historical demand
- Capacity per hour is used to estimate the strain on turnaround time

This produces:

- Predicted daily order volume
- Estimated turnaround time per day
- The busiest day of the week
- The calmest day of the week
- A recommended best pickup window

### 6.2 Why This Counts as ML Logic

While this is not yet a production-grade deep-learning pipeline, it is still predictive modeling based on historical patterns and operational variables. It is suitable for a strong MVP and easy to explain in project presentations.

### 6.3 Production Upgrade Options

Future upgrades can include:

- XGBoost for delivery-time prediction
- Prophet for weekly demand forecasting
- LSTM/GRU for sequence-based laundry demand prediction
- Real-time owner-updated queue ingestion
- Personalized ranking by user preferences and distance

---

## 7. Data Model

Relevant files:

- [`lib/types.ts`](/Users/yashraj/Desktop/LaundroTrack/lib/types.ts)
- [`lib/data.ts`](/Users/yashraj/Desktop/LaundroTrack/lib/data.ts)

### 7.1 Laundry

Each laundry includes:

- ID
- Name
- Address
- Owner name
- Latitude and longitude
- Distance
- Rating
- ETA
- Position note
- Service pricing
- Weekly demand history
- Capacity per hour
- Live queue load
- Open/closed state
- Queue-enabled flag
- Operating hours text

### 7.2 Order

Each order includes:

- Order ID
- Laundry ID
- Customer name
- Hostel
- Pickup slot
- Item list
- Total amount
- Predicted turnaround hours
- Ordered status steps

### 7.3 Auth Account

Accounts are split into:

- Student accounts with hostel information
- Owner accounts with laundry name and address

---

## 8. Ordering Logic

Relevant file:

- [`components/order-form.tsx`](/Users/yashraj/Desktop/LaundroTrack/components/order-form.tsx)

The form behaves as follows:

1. User selects a laundry.
2. Clothing items are chosen with quantities.
3. The total is calculated in INR.
4. Delivery time is estimated using order quantity and queue load.
5. If the laundry is open:
   - the order is placed immediately
6. If the laundry is closed but queueing is enabled:
   - the order is queued for the owner
7. A user message confirms the action taken

This logic supports the exact workflow you requested:

- direct ordering for open laundries
- queueing for closed laundries

---

## 9. Map Interaction Flow

The intended map-related user journey is:

1. Student opens the dashboard
2. Browser requests geolocation permission
3. Google Maps centers around the current location
4. Google Places searches for nearby laundries
5. Nearby laundries are shown as numbered pins
6. The same laundries are listed below the map
7. User views details and chooses a laundry
8. User proceeds to the Orders + Tracking tab

If live Places results are unavailable, the application falls back to seeded laundries so the UI remains functional.

---

## 10. API Routes

Relevant files:

- [`app/api/laundries/route.ts`](/Users/yashraj/Desktop/LaundroTrack/app/api/laundries/route.ts)
- [`app/api/orders/route.ts`](/Users/yashraj/Desktop/LaundroTrack/app/api/orders/route.ts)
- [`app/api/insights/route.ts`](/Users/yashraj/Desktop/LaundroTrack/app/api/insights/route.ts)

### 10.1 `GET /api/laundries`

Returns seeded laundries.

### 10.2 `GET /api/orders`

Returns seeded orders.

### 10.3 `POST /api/orders`

Accepts an order payload and returns a demo acceptance response.

### 10.4 `GET /api/insights`

Returns all generated ML insight objects.

These routes currently act as MVP stubs and are ready to be replaced with real persistence later.

---

## 11. Authentication Design

Auth in this project is intentionally lightweight for MVP/prototype development.

Current implementation:

- Demo accounts from seeded data
- New signup stored in browser `localStorage`
- Role-specific login validation

This is enough for:

- demonstration
- college project presentations
- UI/UX validation
- prototype testing

For production, this should be replaced with:

- a real database
- hashed passwords
- secure sessions or JWTs
- backend validation
- role-based authorization

---

## 12. File Structure

High-level project structure:

```text
LaundroTrack/
├── app/
│   ├── api/
│   ├── auth/
│   ├── orders/
│   ├── owner/
│   ├── student/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── google-map.tsx
│   ├── login-page-client.tsx
│   ├── order-form.tsx
│   ├── orders-tracking-page.tsx
│   ├── owner-dashboard.tsx
│   └── student-dashboard.tsx
├── lib/
│   ├── auth.ts
│   ├── data.ts
│   ├── ml.ts
│   ├── types.ts
│   └── utils.ts
├── .env.example
├── .env.local
├── package.json
├── README.md
└── PROJECT_DOCUMENTATION.md
```

---

## 13. Environment Configuration

Relevant files:

- [`.env.example`](/Users/yashraj/Desktop/LaundroTrack/.env.example)
- [`.env.local`](/Users/yashraj/Desktop/LaundroTrack/.env.local)

Current environment values used by the app:

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`

Important note:

These are public client-side keys because they are used in browser-loaded Google scripts. In production, they must be restricted in Google Cloud using:

- HTTP referrer restrictions
- API restrictions
- domain-specific allowlists

---

## 14. How to Run the Project

### Prerequisites

- Node.js 20+
- npm

### Steps

1. Install dependencies

```bash
npm install
```

2. Ensure `.env.local` contains the Google API keys

3. Start the development server

```bash
npm run dev
```

4. Open the local app in the browser

```text
http://localhost:3000
```

5. Allow location access when prompted

### Build Validation

The project has been build-verified successfully with:

```bash
npm run build
```

---

## 15. Demo Credentials

Student demo account:

- Email: `student@laundrotrack.in`
- Password: `student123`

Owner demo account:

- Email: `owner@freshloop.in`
- Password: `owner123`

New accounts can also be created through the signup page.

---

## 16. UI / UX Design Direction

The UI uses a custom warm-toned visual system rather than a generic dashboard template.

Design characteristics:

- Soft cream background with gradient overlays
- Rounded cards and panels
- Serif-led typography for a more distinct visual tone
- Clear separation between discovery, insights, ordering, and owner actions
- Mobile-responsive grid layout

Relevant file:

- [`app/globals.css`](/Users/yashraj/Desktop/LaundroTrack/app/globals.css)

---

## 17. Current Limitations

This is a strong MVP, but a few areas are still prototype-level:

- Signup and login use browser storage instead of a real backend
- Orders are not persisted in a real database
- Live tracking is currently demo-seeded rather than real-time websocket driven
- Owner updates do not yet persist across sessions
- Google Places results do not yet map one-to-one into full internal laundry profiles with custom pricing

---

## 18. Recommended Next Steps

If you want to turn this into a stronger product or final-year project, the next recommended upgrades are:

- Add PostgreSQL or MongoDB for real persistence
- Add NextAuth or custom auth with password hashing
- Add WebSockets or Firebase for real-time status notifications
- Store owner-managed laundries in the database
- Convert live nearby Places results into user-selectable orderable laundries
- Add payment integration
- Add order history
- Add rating and review system
- Add push notifications
- Add admin analytics dashboard

---

## 19. Best Presentation Summary

If you need a short presentation-ready explanation:

LaundroTrack is an AI/ML-powered laundry service platform for students and hostel residents. It helps users find nearby laundries on Google Maps, predicts rush hours using historical demand and queue analysis, enables clothing-based order placement in rupees, and provides live order status updates similar to food-delivery apps. It also offers a dedicated owner portal where laundry operators can manage queue pressure, location, and customer updates.

---

## 20. Important Project Files

For fast navigation, these are the most important files in the codebase:

- [`app/page.tsx`](/Users/yashraj/Desktop/LaundroTrack/app/page.tsx)
- [`components/student-dashboard.tsx`](/Users/yashraj/Desktop/LaundroTrack/components/student-dashboard.tsx)
- [`components/google-map.tsx`](/Users/yashraj/Desktop/LaundroTrack/components/google-map.tsx)
- [`components/orders-tracking-page.tsx`](/Users/yashraj/Desktop/LaundroTrack/components/orders-tracking-page.tsx)
- [`components/order-form.tsx`](/Users/yashraj/Desktop/LaundroTrack/components/order-form.tsx)
- [`components/owner-dashboard.tsx`](/Users/yashraj/Desktop/LaundroTrack/components/owner-dashboard.tsx)
- [`components/login-page-client.tsx`](/Users/yashraj/Desktop/LaundroTrack/components/login-page-client.tsx)
- [`app/auth/signup/page.tsx`](/Users/yashraj/Desktop/LaundroTrack/app/auth/signup/page.tsx)
- [`lib/data.ts`](/Users/yashraj/Desktop/LaundroTrack/lib/data.ts)
- [`lib/ml.ts`](/Users/yashraj/Desktop/LaundroTrack/lib/ml.ts)
- [`lib/auth.ts`](/Users/yashraj/Desktop/LaundroTrack/lib/auth.ts)

---

## 21. Conclusion

LaundroTrack already demonstrates the essential ingredients of a full-stack AI/ML product:

- user-facing discovery
- owner operations
- predictive logic
- role-based auth
- API integration
- map-based UX
- order and status workflow

It is a solid base for an academic project, MVP, internship demo, or startup prototype. With real persistence and real-time infrastructure added, it can evolve into a production-ready application.
