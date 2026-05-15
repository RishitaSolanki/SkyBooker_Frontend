# ✈ SkyBooker Frontend

A React + Vite flight booking frontend with a MakeMyTrip-inspired **red & white** theme, connected to the SkyBooker microservices backend.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start the dev server
```bash
npm run dev
```

Open http://localhost:3000

---

## 🔌 Backend Services Required

Make sure these .NET services are running locally:

| Service         | Port  | Endpoint              |
|----------------|-------|-----------------------|
| AuthService     | 5010  | http://localhost:5010 |
| FlightService   | 5214  | http://localhost:5214 |
| BookingService  | 5087  | http://localhost:5087 |
| SeatService     | 5200  | http://localhost:5200 |
| PassengerService| 5300  | http://localhost:5300 |
| PaymentService  | 5400  | http://localhost:5400 |

---

## 📁 Project Structure

```
skybooker-frontend/
├── index.html          # Entry HTML
├── vite.config.js      # Vite + API proxy config
├── package.json        # Dependencies
├── README.md           # This file
└── src/
    ├── main.jsx        # React root mount
    └── App.jsx         # Full app (single-file architecture)
```

---

## ✨ Features

- 🔐 **Auth** — Register & Login with JWT (AuthService)
- 🔍 **Flight Search** — Search by origin/destination/date (FlightService)
- ✈ **Flight Results** — Cards with price, duration, seat count, status
- 🎫 **Book Flights** — Meal preference, luggage, fare breakdown
- 📋 **My Trips** — View all your bookings with PNR codes
- 👤 **Profile** — View account details, sign out

---

## 🛠 Build for Production

```bash
npm run build
```

Output goes to `dist/` folder.
