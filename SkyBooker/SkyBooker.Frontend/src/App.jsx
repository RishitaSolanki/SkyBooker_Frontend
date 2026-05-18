import { useState, useEffect } from "react";

// API Base URLs
const API = {
  auth: "https://skybooker-auth-la7d.onrender.com/api/auth",
  flight: "https://skybooker-flight-x36m.onrender.com/api/flight",
  booking: "https://skybooker-booking-2ws8.onrender.com/api/booking",
  seat: "https://skybooker-seat-ejtb.onrender.com/api/seat",
  passenger: "https://skybooker-passenger-l9dl.onrender.com/api/passenger",
  payment: "https://skybooker-payment-qy5w.onrender.com/api/payment",
  notification: "https://skybooker-notification-o6ak.onrender.com/api/notification",
  airline: "https://skybooker-airline-5xwu.onrender.com/api/airlines",
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  new Date(d).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const fmtDur = (min) => `${Math.floor(min / 60)}h ${min % 60}m`;

const token = () => localStorage.getItem("sb_token");
const authHeader = () => ({ Authorization: `Bearer ${token()}` });

async function apiFetch(url, opts = {}) {
  const { headers, ...restOpts } = opts;
  const res = await fetch(url, {
    ...restOpts,
    headers: { "Content-Type": "application/json", ...authHeader(), ...headers },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const s = {
  app: {
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    minHeight: "100vh",
    background: "#f5f5f5",
    color: "#333",
  },
  nav: {
    background: "linear-gradient(135deg, #e63946 0%, #c1121f 100%)",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    boxShadow: "0 2px 12px rgba(230,57,70,0.3)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    color: "#fff",
    fontWeight: 800,
    fontSize: 22,
    letterSpacing: "-0.5px",
    cursor: "pointer",
  },
  logoSpan: { color: "#ffd60a" },
  navLinks: { display: "flex", gap: 8, alignItems: "center" },
  navBtn: (active) => ({
    background: active ? "rgba(255,255,255,0.25)" : "transparent",
    border: active ? "1px solid rgba(255,255,255,0.5)" : "1px solid transparent",
    color: "#fff",
    padding: "6px 14px",
    borderRadius: 20,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    transition: "all 0.2s",
  }),
  hero: {
    background: "linear-gradient(160deg, #e63946 0%, #c1121f 60%, #780000 100%)",
    padding: "48px 24px 80px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 36,
    fontWeight: 800,
    margin: "0 0 8px",
    textShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  heroSub: { color: "rgba(255,255,255,0.85)", fontSize: 16, margin: "0 0 32px" },
  searchCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    maxWidth: 900,
    margin: "0 auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    position: "relative",
    zIndex: 2,
  },
  tabs: { display: "flex", gap: 4, marginBottom: 20 },
  tab: (active) => ({
    background: active ? "#e63946" : "#f0f0f0",
    color: active ? "#fff" : "#666",
    border: "none",
    padding: "8px 20px",
    borderRadius: 20,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    transition: "all 0.2s",
  }),
  searchGrid: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr auto auto",
    gap: 12,
    alignItems: "end",
  },
  field: { display: "flex", flexDirection: "column", gap: 4 },
  label: { fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 0.5 },
  input: {
    border: "2px solid #e8e8e8",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 15,
    fontWeight: 600,
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
    background: "#fafafa",
  },
  swapBtn: {
    background: "#fff",
    border: "2px solid #e63946",
    borderRadius: "50%",
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#e63946",
    fontSize: 18,
    fontWeight: 700,
    flexShrink: 0,
    alignSelf: "center",
    marginTop: 16,
  },
  searchBtn: {
    background: "linear-gradient(135deg, #e63946, #c1121f)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "12px 28px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(230,57,70,0.4)",
    transition: "transform 0.1s",
    whiteSpace: "nowrap",
    alignSelf: "flex-end",
  },
  main: { maxWidth: 1100, margin: "0 auto", padding: "32px 24px" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#222",
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  flightCard: {
    background: "#fff",
    borderRadius: 12,
    padding: "20px 24px",
    marginBottom: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr auto",
    alignItems: "center",
    gap: 16,
    border: "1px solid #f0f0f0",
    transition: "box-shadow 0.2s, transform 0.2s",
    cursor: "pointer",
  },
  flightRoute: { display: "flex", alignItems: "center", gap: 12 },
  airportCode: { fontSize: 24, fontWeight: 800, color: "#222" },
  airportName: { fontSize: 11, color: "#999", marginTop: 2 },
  routeLine: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  routeDash: { width: "100%", height: 1, background: "#ddd", position: "relative" },
  duration: { fontSize: 11, color: "#888", fontWeight: 600 },
  badge: (color) => ({
    background: color === "green" ? "#e8f5e9" : color === "red" ? "#fce4ec" : "#fff3e0",
    color: color === "green" ? "#2e7d32" : color === "red" ? "#c62828" : "#e65100",
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 8px",
    borderRadius: 4,
  }),
  price: { fontSize: 22, fontWeight: 800, color: "#e63946" },
  priceLabel: { fontSize: 11, color: "#999" },
  bookBtn: {
    background: "linear-gradient(135deg, #e63946, #c1121f)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 3px 10px rgba(230,57,70,0.3)",
  },
  // Modal
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    background: "#fff",
    borderRadius: 16,
    padding: 32,
    width: "100%",
    maxWidth: 480,
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
  },
  modalTitle: { fontSize: 22, fontWeight: 800, margin: "0 0 24px", color: "#222" },
  formGroup: { marginBottom: 16 },
  formLabel: { display: "block", fontSize: 12, fontWeight: 700, color: "#666", marginBottom: 6, textTransform: "uppercase" },
  formInput: {
    width: "100%",
    border: "2px solid #e8e8e8",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  submitBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #e63946, #c1121f)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "12px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 8,
    boxShadow: "0 4px 15px rgba(230,57,70,0.35)",
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "#f5f5f5",
    border: "none",
    borderRadius: "50%",
    width: 32,
    height: 32,
    cursor: "pointer",
    fontSize: 18,
    color: "#666",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  // Booking card
  bookingCard: {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    border: "1px solid #f0f0f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  pnr: { fontSize: 18, fontWeight: 800, color: "#e63946", fontFamily: "monospace" },
  // Profile
  profileCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 32,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    maxWidth: 500,
    margin: "0 auto",
  },
  avatar: {
    width: 80,
    height: 80,
    background: "linear-gradient(135deg, #e63946, #c1121f)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 32,
    fontWeight: 800,
    margin: "0 auto 20px",
  },
  // Alert
  alert: (type) => ({
    background: type === "error" ? "#fce4ec" : "#e8f5e9",
    color: type === "error" ? "#c62828" : "#2e7d32",
    border: `1px solid ${type === "error" ? "#ef9a9a" : "#a5d6a7"}`,
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    marginBottom: 16,
    fontWeight: 500,
  }),
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#999",
  },
  spinner: {
    width: 36,
    height: 36,
    border: "4px solid #f0f0f0",
    borderTop: "4px solid #e63946",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    margin: "40px auto",
  },
  // Seat Selection Styles
  seatMapContainer: {
    padding: 20,
    background: "#fff",
    borderRadius: 12,
    marginTop: 16,
    border: "1px solid #eee",
  },
  seatGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 8,
    margin: "20px 0",
    justifyItems: "center",
  },
  seat: (status, isSelected, seatClass) => ({
    width: 32,
    height: 32,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 800,
    cursor: status === "AVAILABLE" ? "pointer" : "not-allowed",
    background: isSelected ? "#e63946" : 
                (status === "AVAILABLE" ? (seatClass === "Business" ? "#e3f2fd" : "#e8f5e9") : 
                (status === "HELD" ? "#fff3e0" : "#eee")),
    color: isSelected ? "#fff" : 
           (status === "AVAILABLE" ? (seatClass === "Business" ? "#1976d2" : "#2e7d32") : "#999"),
    border: isSelected ? "2px solid #c1121f" : 
            (status === "AVAILABLE" && seatClass === "Business" ? "1px solid #2196f3" : "1px solid transparent"),
    boxShadow: isSelected ? "0 2px 8px rgba(230,57,70,0.4)" : "none",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: isSelected ? "scale(1.1)" : "none",
  }),
  seatLegend: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    fontSize: 12,
    color: "#666",
    marginTop: 16,
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  legendColor: (color) => ({
    width: 12,
    height: 12,
    borderRadius: 2,
    background: color,
  }),
};

// ─── Components ──────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={s.spinner} />
    </>
  );
}

function AuthModal({ mode, onClose, onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        const data = await apiFetch(`${API.auth}/login`, {
          method: "POST",
          body: JSON.stringify({ email: form.email, password: form.password }),
          headers: {},
        });
        localStorage.setItem("sb_token", data.token || data.Token || "");
        localStorage.setItem("sb_user", JSON.stringify(data.user || data.User || data));
        onSuccess(data);
      } else {
        await apiFetch(`${API.auth}/register`, {
          method: "POST",
          body: JSON.stringify({ 
            email: form.email, 
            password: form.password, 
            FullName: `${form.firstName} ${form.lastName}`.trim() 
          }),
          headers: {},
        });
        setError("");
        alert("Registered! Please log in.");
        onClose();
      }
    } catch (err) {
      setError(mode === "login" ? "Invalid credentials. Please try again." : "Registration failed. Try again.");
    }
    setLoading(false);
  }

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <button style={s.closeBtn} onClick={onClose}>✕</button>
        <h2 style={s.modalTitle}>{mode === "login" ? "🔐 Welcome Back" : "✈️ Join SkyBooker"}</h2>
        {error && <div style={s.alert("error")}>{error}</div>}
        <form onSubmit={submit}>
          {mode === "register" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={s.formGroup}>
                <label style={s.formLabel}>First Name</label>
                <input style={s.formInput} value={form.firstName} onChange={set("firstName")} required />
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>Last Name</label>
                <input style={s.formInput} value={form.lastName} onChange={set("lastName")} required />
              </div>
            </div>
          )}
          <div style={s.formGroup}>
            <label style={s.formLabel}>Email</label>
            <input style={s.formInput} type="email" value={form.email} onChange={set("email")} required />
          </div>
          <div style={s.formGroup}>
            <label style={s.formLabel}>Password</label>
            <input style={s.formInput} type="password" value={form.password} onChange={set("password")} required />
          </div>
          {mode === "register" && (
            <div style={s.formGroup}>
              <label style={s.formLabel}>Phone</label>
              <input style={s.formInput} value={form.phone} onChange={set("phone")} />
            </div>
          )}
          <button style={s.submitBtn} type="submit" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

function BookingModal({ flight, onClose, onBooked }) {
  const isRoundTrip = Array.isArray(flight);
  const flights = isRoundTrip ? flight : [flight];

  const [stage, setStage] = useState("details"); // details, seats, summary
  const [form, setForm] = useState({
    contactEmail: "", contactPhone: "", mealPreference: "Veg", luggageKg: 15,
  });
  const [selectedSeats, setSelectedSeats] = useState([]); // [{ flightId, seatId, seatNumber }]
  const [seatMap, setSeatMap] = useState({}); // { flightId: [seats] }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userRaw = localStorage.getItem("sb_user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const getSeatPrice = (s) => {
    if (!s) return 0;
    const sClass = s.seatClass ?? s.SeatClass ?? "Economy";
    const flight = flights.find(f => f.flightId === s.flightId) || flights[0];
    if (!flight) return 0;
    const price = sClass === "Business" ? (flight.businessPrice ?? flight.BusinessPrice ?? 0) : (flight.economyPrice ?? flight.EconomyPrice ?? 0);
    return parseFloat(price) || 0;
  };

  const totalBase = selectedSeats.length > 0
    ? selectedSeats.reduce((sum, s) => sum + getSeatPrice(s), 0)
    : flights.reduce((sum, f) => sum + (parseFloat(f.economyPrice) || parseFloat(f.EconomyPrice) || 0), 0);
  const taxes = parseFloat((totalBase * 0.18).toFixed(2));
  const total = (totalBase + taxes).toFixed(2);

  async function fetchSeats() {
    setLoading(true);
    try {
      const maps = {};
      for (const f of flights) {
        const res = await apiFetch(`${API.seat}/flight/${f.flightId}`);
        maps[f.flightId] = res.data || res.Data || res;
      }
      setSeatMap(maps);
      setStage("seats");
    } catch (err) {
      setError("Failed to load seat map.");
    }
    setLoading(false);
  }

  const toggleSeat = async (flightId, seat) => {
    const sId = seat.seatId ?? seat.SeatId;
    const sNum = seat.seatNumber ?? seat.SeatNumber;

    const isSelected = selectedSeats.find(s => s.seatId === sId);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.seatId !== sId));
    } else {
      try {
        await apiFetch(`${API.seat}/${sId}/hold`, { method: "PATCH" });
        const sClass = seat.seatClass ?? seat.SeatClass;
        setSelectedSeats([...selectedSeats, { flightId, seatId: sId, seatNumber: sNum, seatClass: sClass }]);
      } catch (err) {
        alert("This seat is no longer available.");
      }
    }
  };

  // Helper to load Razorpay script dynamically if not already present
  async function loadRazorpay() {
    if (window.Razorpay) return true;
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function submitPayment() {
    if (selectedSeats.length < flights.length) {
      alert("Please select a seat for all flights.");
      return;
    }

    const amountNum = parseFloat(total);
    if (!amountNum || amountNum <= 0) {
      setError("Invalid booking amount. Please re-select your seats.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // 0. Ensure Razorpay script is loaded
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded || !window.Razorpay) {
        setError("Payment gateway (Razorpay) failed to load. Check your internet connection.");
        setLoading(false);
        return;
      }

      // 1. Create Razorpay Order
      const orderRes = await apiFetch(`${API.payment}/create-order`, {
        method: "POST",
        body: JSON.stringify({ amount: amountNum, currency: "INR" })
      });

      const orderId = orderRes?.orderId || orderRes?.OrderId;
      const keyId   = orderRes?.keyId   || orderRes?.KeyId;

      if (!orderId || !keyId) {
        setError("Failed to create payment order. Please try again.");
        setLoading(false);
        return;
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: keyId,
        amount: amountNum * 100,
        currency: "INR",
        name: "SkyBooker",
        description: isRoundTrip ? "Round Trip Flight Booking" : "One Way Flight Booking",
        order_id: orderId,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            await apiFetch(`${API.payment}/verify`, {
              method: "POST",
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              })
            });

            // 4. Create Bookings for each person
            const userId = user?.userId || user?.id || "guest";
            const bookings = [];
            
            // Group selected seats by "person" index
            const seatsByFlight = {};
            flights.forEach(f => {
              seatsByFlight[f.flightId] = selectedSeats.filter(s => s.flightId === f.flightId);
            });
            
            const numSeats = seatsByFlight[flights[0].flightId].length;

            for (let i = 0; i < numSeats; i++) {
              for (const f of flights) {
                const selSeat = seatsByFlight[f.flightId][i];
                const price = getSeatPrice(selSeat) || parseFloat(f.economyPrice) || 0;
                
                const b = await apiFetch(`${API.booking}`, {
                  method: "POST",
                  body: JSON.stringify({
                    userId,
                    flightId: f.flightId,
                    tripType: isRoundTrip ? "ROUND_TRIP" : "ONE_WAY",
                    baseFare: price,
                    taxes: parseFloat((price * 0.18).toFixed(2)),
                    totalFare: parseFloat((price * 1.18).toFixed(2)),
                    contactEmail: form.contactEmail,
                    contactPhone: form.contactPhone,
                    mealPreference: form.mealPreference,
                    luggageKg: parseInt(form.luggageKg),
                  }),
                });

                // 5. Confirm Seat & Decrement Flight Seats
                if (selSeat) {
                  const sId = selSeat.seatId ?? selSeat.SeatId;
                  try { await apiFetch(`${API.seat}/${sId}/confirm`, { method: "PATCH" }); } catch {}
                  try { await apiFetch(`${API.flight}/${f.flightId}/seats/decrement?count=1`, { method: "PATCH" }); } catch {}
                }
                
                bookings.push(b);
              }
            }
            onBooked(bookings[0]);
          } catch (err) {
            console.error("Booking failed after payment:", err);
            setError("Payment verified but booking failed: " + (err?.message || "Please contact support."));
            setLoading(false);
          }
        },
        prefill: {
          name: user?.firstName || "Guest",
          email: form.contactEmail,
          contact: form.contactPhone
        },
        theme: { color: "#e63946" },
        modal: {
          ondismiss: () => setLoading(false)
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function(response) {
        setError("Payment failed: " + (response.error?.description || "Unknown error."));
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Payment initiation error:", err);
      setError("Failed to initiate payment: " + (err?.message || "Please try again."));
      setLoading(false);
    }
  }

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={{ ...s.modal, maxWidth: stage === "seats" ? 600 : 480 }} onClick={(e) => e.stopPropagation()}>
        <button style={s.closeBtn} onClick={onClose}>✕</button>
        <h2 style={s.modalTitle}>
          {stage === "details" && "✈️ Contact Details"}
          {stage === "seats" && "💺 Select Your Seat"}
        </h2>

        {error && <div style={s.alert("error")}>{error}</div>}

        {stage === "details" && (
          <form onSubmit={(e) => { e.preventDefault(); fetchSeats(); }}>
            <div style={s.formGroup}>
              <label style={s.formLabel}>Contact Email</label>
              <input style={s.formInput} type="email" value={form.contactEmail} onChange={set("contactEmail")} required />
            </div>
            <div style={s.formGroup}>
              <label style={s.formLabel}>Contact Phone</label>
              <input style={s.formInput} value={form.contactPhone} onChange={set("contactPhone")} required />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={s.formGroup}>
                <label style={s.formLabel}>Meal Preference</label>
                <select style={s.formInput} value={form.mealPreference} onChange={set("mealPreference")}>
                  <option>Veg</option>
                  <option>Non-Veg</option>
                  <option>Vegan</option>
                  <option>Jain</option>
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.formLabel}>Luggage (kg)</label>
                <select style={s.formInput} value={form.luggageKg} onChange={set("luggageKg")}>
                  {[15, 20, 25, 30].map((k) => <option key={k} value={k}>{k} kg</option>)}
                </select>
              </div>
            </div>
            <button style={s.submitBtn} type="submit" disabled={loading}>
              {loading ? "Loading..." : "Next: Select Seats"}
            </button>
          </form>
        )}

        {stage === "seats" && (
          <div>
            {flights.map(f => (
              <div key={f.flightId} style={s.seatMapContainer}>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>{f.originAirportCode} → {f.destinationAirportCode} ({f.flightNumber})</div>
                <div style={s.seatGrid}>
                    {seatMap[f.flightId]?.map(seat => {
                      const sId = seat.seatId ?? seat.SeatId;
                      const sNum = seat.seatNumber ?? seat.SeatNumber;
                      const sStatus = seat.status ?? seat.Status;
                      const sClass = seat.seatClass ?? seat.SeatClass;
                      return (
                        <div
                          key={sId}
                          style={s.seat(sStatus, selectedSeats.some(s => s.seatId === sId), sClass)}
                          onClick={() => sStatus === "AVAILABLE" && toggleSeat(f.flightId, seat)}
                          title={`${sNum} - ${sClass} Class (₹${sClass === "Business" ? f.businessPrice : f.economyPrice})`}
                        >
                          {sNum}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}

            <div style={s.seatLegend}>
              <div style={s.legendItem}><div style={s.legendColor("#e8f5e9", "#2196f3")}></div> Economy</div>
              <div style={s.legendItem}><div style={s.legendColor("#e3f2fd", "#2196f3", "1px solid #2196f3")}></div> Business</div>
              <div style={s.legendItem}><div style={s.legendColor("#e63946")}></div> Selected</div>
              <div style={s.legendItem}><div style={s.legendColor("#eee")}></div> Occupied</div>
            </div>

            <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: "#999" }}>Selected Seats</div>
                <div style={{ fontWeight: 700 }}>{selectedSeats.map(s => s.seatNumber).join(", ") || "None"}</div>
              </div>
              <button 
                style={{ ...s.submitBtn, width: "auto", padding: "12px 32px" }} 
                onClick={submitPayment} 
                disabled={loading || selectedSeats.length === 0 || (isRoundTrip && selectedSeats.length % 2 !== 0)}
              >
                {loading ? "Processing..." : `Pay ₹${total} & Confirm`}
              </button>
            </div>
            <button 
              style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 13, marginTop: 16 }}
              onClick={() => setStage("details")}
            >
              ← Back to Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FlightCard({ flight, onBook }) {
  const statusColor = flight.status === "SCHEDULED" ? "green" : flight.status === "CANCELLED" ? "red" : "orange";
  return (
    <div
      style={s.flightCard}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "none"; }}
    >
      {/* Route */}
      <div>
        <div style={{ fontSize: 12, color: "#999", fontWeight: 600, marginBottom: 4 }}>{flight.airlineName}</div>
        <div style={s.flightRoute}>
          <div>
            <div style={s.airportCode}>{flight.originAirportCode}</div>
            <div style={s.airportName}>{new Date(flight.departureTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
          </div>
          <div style={s.routeLine}>
            <div style={s.duration}>{fmtDur(flight.durationMinutes)}</div>
            <div style={s.routeDash}>
              <span style={{ position: "absolute", left: "50%", top: -6, transform: "translateX(-50%)", color: "#e63946", fontSize: 14 }}>✈</span>
            </div>
            <div style={{ fontSize: 10, color: "#bbb" }}>Direct</div>
          </div>
          <div>
            <div style={s.airportCode}>{flight.destinationAirportCode}</div>
            <div style={s.airportName}>{new Date(flight.arrivalTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div>
        <div style={{ marginBottom: 6 }}>
          <span style={s.badge(statusColor)}>{flight.status}</span>
        </div>
        <div style={{ fontSize: 12, color: "#666" }}>Flight: <strong>{flight.flightNumber}</strong></div>
        <div style={{ fontSize: 12, color: "#666" }}>Aircraft: {flight.aircraftType}</div>
        <div style={{ fontSize: 12, color: "#666" }}>Seats left: <strong style={{ color: flight.availableSeats < 10 ? "#e63946" : "#333" }}>{flight.availableSeats}</strong></div>
      </div>

      {/* Date */}
      <div>
        <div style={{ fontSize: 12, color: "#999" }}>Departure</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{fmtDate(flight.departureTime)}</div>
        <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>Arrival</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{fmtDate(flight.arrivalTime)}</div>
      </div>

      {/* Price + CTA */}
      <div style={{ textAlign: "right" }}>
        <div style={s.priceLabel}>Starting from</div>
        <div style={{ ...s.price, fontSize: 18 }}>₹{Math.round(flight.economyPrice)} <span style={{ fontSize: 11, color: "#999" }}>(Eco)</span></div>
        <div style={{ ...s.price, fontSize: 18, color: "#1e3a8a" }}>₹{Math.round(flight.businessPrice)} <span style={{ fontSize: 11, color: "#999" }}>(Bus)</span></div>
        <button style={{ ...s.bookBtn, marginTop: 8 }} onClick={() => onBook(flight)} disabled={flight.availableSeats === 0}>
          {flight.availableSeats === 0 ? "Sold Out" : "Book Now"}
        </button>
      </div>
    </div>
  );
}

function ManagementDashboard({ role }) {
  const [activeTab, setActiveTab] = useState(role === "ADMIN" ? "staff" : "flights");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  // Staff Form
  const [staffForm, setStaffForm] = useState({ email: "", password: "", fullName: "" });
  
  // Flight Form
  const [flightForm, setFlightForm] = useState({
    flightNumber: "",
    airlineId: 1,
    origin: "",
    destination: "",
    departure: "",
    arrival: "",
    aircraft: "",
    seats: 200,
    businessPrice: 8000,
    economyPrice: 5000
  });

  const [managedFlights, setManagedFlights] = useState([]);

  useEffect(() => {
    if (activeTab === "flights") fetchManagedFlights();
  }, [activeTab]);

  async function fetchManagedFlights() {
    try {
      const res = await apiFetch(API.flight);
      setManagedFlights(Array.isArray(res) ? res : (res.data || res.Data || []));
    } catch (err) {}
  }

  async function deleteFlight(id) {
    if (!window.confirm("Are you sure? This will delete the flight and cancel all associated bookings.")) return;
    try {
      await apiFetch(`${API.flight}/${id}`, { method: "DELETE" });
      setMsg({ text: "Flight deleted and bookings cancelled!", type: "success" });
      fetchManagedFlights();
    } catch (err) {
      setMsg({ text: "Failed to delete flight.", type: "error" });
    }
  }

  async function createStaff(e) {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });
    try {
      await apiFetch(`${API.auth}/register`, {
        method: "POST",
        body: JSON.stringify({ 
          email: staffForm.email, 
          password: staffForm.password, 
          FullName: staffForm.fullName, 
          Role: "AIRLINE_STAFF" 
        }),
      });
      setMsg({ text: "Airline Staff account created successfully!", type: "success" });
      setStaffForm({ email: "", password: "", fullName: "" });
    } catch (err) {
      setMsg({ text: "Failed to create account. Email might already exist.", type: "error" });
    }
    setLoading(false);
  }

  async function createFlight(e) {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });
    try {
      await apiFetch(`${API.flight}`, {
        method: "POST",
        body: JSON.stringify({
          flightNumber: flightForm.flightNumber,
          airlineId: parseInt(flightForm.airlineId),
          originAirportCode: flightForm.origin.toUpperCase(),
          destinationAirportCode: flightForm.destination.toUpperCase(),
          departureTime: new Date(flightForm.departure).toISOString(),
          arrivalTime: new Date(flightForm.arrival).toISOString(),
          aircraftType: flightForm.aircraft,
          totalSeats: parseInt(flightForm.seats),
          businessPrice: parseFloat(flightForm.businessPrice),
          economyPrice: parseFloat(flightForm.economyPrice)
        }),
      });
      setMsg({ text: "Flight created successfully!", type: "success" });
      setFlightForm({ flightNumber: "", airlineId: 1, origin: "", destination: "", departure: "", arrival: "", aircraft: "", seats: 200, businessPrice: 8000, economyPrice: 5000 });
    } catch (err) {
      setMsg({ text: "Failed to create flight. Check all fields.", type: "error" });
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 32, background: "#fff", borderRadius: 20, boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}>
      <h2 style={{ marginBottom: 32, fontSize: 28, fontWeight: 800, color: "#e63946", display: "flex", alignItems: "center", gap: 12 }}>
        {role === "ADMIN" ? "🛡️ Admin Dashboard" : "✈️ Staff Dashboard"}
      </h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 32, borderBottom: "1px solid #eee", paddingBottom: 16 }}>
        {role === "ADMIN" && (
          <button 
            style={{ ...s.tab(activeTab === "staff"), borderRadius: 8 }} 
            onClick={() => { setActiveTab("staff"); setMsg({ text: "", type: "" }); }}
          >
            Manage Staff
          </button>
        )}
        <button 
          style={{ ...s.tab(activeTab === "flights"), borderRadius: 8 }} 
          onClick={() => { setActiveTab("flights"); setMsg({ text: "", type: "" }); }}
        >
          Manage Flights
        </button>
      </div>

      {msg.text && (
        <div style={{ padding: "12px 16px", borderRadius: 8, marginBottom: 24, fontSize: 14, fontWeight: 600, background: msg.type === "success" ? "#ecfdf5" : "#fef2f2", color: msg.type === "success" ? "#059669" : "#dc2626", border: `1px solid ${msg.type === "success" ? "#34d399" : "#f87171"}` }}>
          {msg.text}
        </div>
      )}

      {activeTab === "staff" && role === "ADMIN" && (
        <form onSubmit={createStaff} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ padding: 16, background: "#f0f7ff", borderRadius: 12, marginBottom: 8 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700 }}>Add New Airline Staff</h3>
            <p style={{ margin: 0, fontSize: 12, color: "#666" }}>Staff members can create and manage flights.</p>
          </div>
          <div style={s.formGroup}>
            <label style={s.formLabel}>Full Name</label>
            <input style={s.formInput} value={staffForm.fullName} onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })} required />
          </div>
          <div style={s.formGroup}>
            <label style={s.formLabel}>Email Address</label>
            <input style={s.formInput} type="email" value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} required />
          </div>
          <div style={s.formGroup}>
            <label style={s.formLabel}>Password</label>
            <input style={s.formInput} type="password" value={staffForm.password} onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })} required />
          </div>
          <button style={s.submitBtn} type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Staff Account"}
          </button>
        </form>
      )}

      {activeTab === "flights" && (
        <form onSubmit={createFlight} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ padding: 16, background: "#fff5f5", borderRadius: 12, marginBottom: 8 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700 }}>Create New Flight</h3>
            <p style={{ margin: 0, fontSize: 12, color: "#666" }}>Add a new flight schedule to the system.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={s.formGroup}>
              <label style={s.formLabel}>Flight Number</label>
              <input style={s.formInput} placeholder="e.g. AI101" value={flightForm.flightNumber} onChange={(e) => setFlightForm({ ...flightForm, flightNumber: e.target.value })} required />
            </div>
            <div style={s.formGroup}>
              <label style={s.formLabel}>Airline ID</label>
              <input style={s.formInput} type="number" value={flightForm.airlineId} onChange={(e) => setFlightForm({ ...flightForm, airlineId: e.target.value })} required />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={s.formGroup}>
              <label style={s.formLabel}>Origin (Code)</label>
              <input style={s.formInput} placeholder="DEL" value={flightForm.origin} onChange={(e) => setFlightForm({ ...flightForm, origin: e.target.value })} required maxLength={3} />
            </div>
            <div style={s.formGroup}>
              <label style={s.formLabel}>Destination (Code)</label>
              <input style={s.formInput} placeholder="BOM" value={flightForm.destination} onChange={(e) => setFlightForm({ ...flightForm, destination: e.target.value })} required maxLength={3} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={s.formGroup}>
              <label style={s.formLabel}>Departure Time</label>
              <input style={s.formInput} type="datetime-local" value={flightForm.departure} onChange={(e) => setFlightForm({ ...flightForm, departure: e.target.value })} required />
            </div>
            <div style={s.formGroup}>
              <label style={s.formLabel}>Arrival Time</label>
              <input style={s.formInput} type="datetime-local" value={flightForm.arrival} onChange={(e) => setFlightForm({ ...flightForm, arrival: e.target.value })} required />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div style={s.formGroup}>
              <label style={s.formLabel}>Aircraft Type</label>
              <input style={s.formInput} placeholder="Boeing 787" value={flightForm.aircraft} onChange={(e) => setFlightForm({ ...flightForm, aircraft: e.target.value })} required />
            </div>
            <div style={s.formGroup}>
              <label style={s.formLabel}>Total Seats</label>
              <input style={s.formInput} type="number" value={flightForm.seats} onChange={(e) => setFlightForm({ ...flightForm, seats: e.target.value })} required />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={s.formGroup}>
              <label style={s.formLabel}>Business Price (₹)</label>
              <input style={s.formInput} type="number" value={flightForm.businessPrice} onChange={(e) => setFlightForm({ ...flightForm, businessPrice: e.target.value })} required />
            </div>
            <div style={s.formGroup}>
              <label style={s.formLabel}>Economy Price (₹)</label>
              <input style={s.formInput} type="number" value={flightForm.economyPrice} onChange={(e) => setFlightForm({ ...flightForm, economyPrice: e.target.value })} required />
            </div>
          </div>
          <button style={s.submitBtn} type="submit" disabled={loading}>
            {loading ? "Creating Flight..." : "Add Flight to Schedule"}
          </button>
        </form>
      )}

      {activeTab === "flights" && managedFlights.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3 style={{ marginBottom: 20, fontSize: 18, fontWeight: 800 }}>Existing Flights</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {managedFlights.map(f => (
              <div key={f.flightId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#f9f9f9", borderRadius: 12, border: "1px solid #eee" }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{f.flightNumber} · {f.originAirportCode} → {f.destinationAirportCode}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{new Date(f.departureTime).toLocaleDateString()} · {f.aircraftType}</div>
                </div>
                <button 
                  onClick={() => deleteFlight(f.flightId)}
                  style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 600 }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReceiptModal({ booking, onClose }) {
  if (!booking || !booking.flight) return null;
  const f = booking.flight;
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={{...s.modal, maxWidth: 500}} onClick={(e) => e.stopPropagation()}>
        <button style={s.closeBtn} onClick={onClose}>✕</button>
        <h2 style={{...s.modalTitle, color: '#e63946'}}>🧾 Booking Receipt</h2>
        
        <div style={{ padding: 20, border: '1px dashed #ccc', borderRadius: 12, background: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: '#999', textTransform: 'uppercase' }}>Passenger Name</div>
              <div style={{ fontWeight: 800 }}>{booking.contactEmail?.split('@')[0] || "Passenger"}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: '#999', textTransform: 'uppercase' }}>PNR Code</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#e63946', fontFamily: 'monospace' }}>{booking.pnrCode}</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, padding: '16px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{f.originAirportCode}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{new Date(f.departureTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
              <div style={{ fontSize: 12, color: '#999' }}>{new Date(f.departureTime).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '0 16px' }}>
              <div style={{ color: '#e63946', fontSize: 20 }}>✈️</div>
              <div style={{ fontSize: 11, color: '#999' }}>{f.flightNumber}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{f.destinationAirportCode}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{new Date(f.arrivalTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
              <div style={{ fontSize: 12, color: '#999' }}>{new Date(f.arrivalTime).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: '#999' }}>Trip / Meal</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{booking.tripType?.replace("_", " ")} · {booking.mealPreference}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#999' }}>Luggage</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{booking.luggageKg} kg</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '2px solid #eee' }}>
            <div style={{ fontSize: 14, color: '#666' }}>Total Amount Paid</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#2e7d32' }}>₹{booking.totalFare}</div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: '#2e7d32', fontWeight: 700 }}>
            {booking.status === 'CONFIRMED' ? '✅ Booking Confirmed' : `Status: ${booking.status}`}
          </div>
        </div>

        <button style={{...s.submitBtn, marginTop: 20}} onClick={() => window.print()}>
          🖨️ Print Receipt
        </button>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("sb_user");
    return u ? JSON.parse(u) : null;
  });
  const [authModal, setAuthModal] = useState(null); // "login" | "register" | null
  const [bookingFlight, setBookingFlight] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Search state
  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  const [date, setDate] = useState("");
  const [tripType, setTripType] = useState("ONE_WAY");
  const [returnDate, setReturnDate] = useState("");

  // Results
  const [flights, setFlights] = useState([]);
  const [outboundFlights, setOutboundFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  function logout() {
    localStorage.removeItem("sb_token");
    localStorage.removeItem("sb_user");
    setUser(null);
    setPage("home");
  }

  function onAuthSuccess(data) {
    const u = data.user || data.User || data;
    setUser(u);
    localStorage.setItem("sb_user", JSON.stringify(u));
    setAuthModal(null);
  }

  async function searchFlights() {
    if (!origin || !dest) return setMsg("Please enter origin and destination.");
    setMsg("");
    setLoading(true);
    setFlights([]);
    setOutboundFlights([]);
    setReturnFlights([]);
    setSelectedOutbound(null);
    setSelectedReturn(null);
    try {
      if (tripType === "ONE_WAY") {
        const data = await apiFetch(`${API.flight}/search/oneway`, {
          method: "POST",
          body: JSON.stringify({
            originAirportCode: origin,
            destinationAirportCode: dest,
            departureDate: date || new Date().toISOString(),
            passengers: 1
          })
        });
        const list = data?.data || data?.Data || data || [];
        setFlights(Array.isArray(list) ? list : []);
        if (!list.length) setMsg("No flights found for this route.");
      } else {
        const data = await apiFetch(`${API.flight}/search/roundtrip`, {
          method: "POST",
          body: JSON.stringify({
            originAirportCode: origin,
            destinationAirportCode: dest,
            departureDate: date || new Date().toISOString(),
            returnDate: returnDate || new Date(new Date().getTime() + 86400000).toISOString(),
            passengers: 1
          })
        });
        const obj = data?.data || data?.Data || data;
        setOutboundFlights(obj?.outbound || obj?.Outbound || []);
        setReturnFlights(obj?.return || obj?.Return || []);
        if (!(obj?.outbound?.length) && !(obj?.return?.length)) {
          setMsg("No flights found for this round trip.");
        }
      }
      setPage("results");
    } catch {
      // Try getAllFlights
      try {
        const all = await apiFetch(`${API.flight}`, { headers: {} });
        const list = all?.data || all?.Data || all || [];
        if (tripType === "ONE_WAY") {
          const filtered = (Array.isArray(list) ? list : []).filter(
            (f) =>
              f.originAirportCode?.toLowerCase().includes(origin.toLowerCase()) &&
              f.destinationAirportCode?.toLowerCase().includes(dest.toLowerCase())
          );
          setFlights(filtered);
          if (!filtered.length) setMsg("No flights found. Try different airports.");
        } else {
          const arr = Array.isArray(list) ? list : [];
          const out = arr.filter(f => f.originAirportCode?.toLowerCase().includes(origin.toLowerCase()) && f.destinationAirportCode?.toLowerCase().includes(dest.toLowerCase()));
          const ret = arr.filter(f => f.originAirportCode?.toLowerCase().includes(dest.toLowerCase()) && f.destinationAirportCode?.toLowerCase().includes(origin.toLowerCase()));
          setOutboundFlights(out);
          setReturnFlights(ret);
          if (!out.length && !ret.length) setMsg("No flights found for this round trip.");
        }
        setPage("results");
      } catch {
        setMsg("Could not connect to the flight service. Ensure backend is running.");
      }
    }
    setLoading(false);
  }

  async function loadBookings() {
    if (!user) return setAuthModal("login");
    setLoading(true);
    setBookings([]);
    try {
      const userId = user?.userId || user?.id || user?.Id;
      const data = await apiFetch(`${API.booking}/user/${userId}`);
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setMsg("Could not load bookings.");
    }
    setLoading(false);
  }

  async function openReceipt(booking) {
    setLoading(true);
    try {
      const res = await apiFetch(`${API.flight}/${booking.flightId}`);
      const flightData = res.data || res.Data || res;
      setSelectedReceipt({ ...booking, flight: flightData });
    } catch (err) {
      alert("Could not load flight details for receipt.");
    }
    setLoading(false);
  }

  function handleBook(flight) {
    if (!user) return setAuthModal("login");
    setBookingFlight(flight);
  }

  function onBooked(booking) {
    setBookingFlight(null);
    setMsg("");
    alert(`🎉 Booking confirmed!\nPNR: ${booking.pnrCode || booking.PnrCode}`);
    setPage("bookings");
    loadBookings();
  }

  useEffect(() => {
    if (page === "bookings") loadBookings();
    // eslint-disable-next-line
  }, [page]);

  // ── Render pages ────────────────────────────────────────────────────────────
  const renderHome = () => (
    <>
      {/* Hero */}
      <div style={s.hero}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <h1 style={s.heroTitle}>Find Your Perfect Flight</h1>
        <p style={s.heroSub}>Search across hundreds of routes · Best fares guaranteed</p>

        {/* Search box */}
        <div style={s.searchCard}>
          <div style={s.tabs}>
            <button style={s.tab(tripType === "ONE_WAY")} onClick={() => setTripType("ONE_WAY")}>✈ One Way</button>
            <button style={s.tab(tripType === "ROUND_TRIP")} onClick={() => setTripType("ROUND_TRIP")}>↔ Round Trip</button>
          </div>
          <div style={s.searchGrid}>
            <div style={s.field}>
              <span style={s.label}>From</span>
              <input
                style={s.input}
                placeholder="e.g. DEL, BOM, BLR"
                value={origin}
                onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                onFocus={(e) => (e.target.style.borderColor = "#e63946")}
                onBlur={(e) => (e.target.style.borderColor = "#e8e8e8")}
              />
            </div>
            <button style={s.swapBtn} onClick={() => { const t = origin; setOrigin(dest); setDest(t); }}>⇄</button>
            <div style={s.field}>
              <span style={s.label}>To</span>
              <input
                style={s.input}
                placeholder="e.g. MAA, HYD, CCU"
                value={dest}
                onChange={(e) => setDest(e.target.value.toUpperCase())}
                onFocus={(e) => (e.target.style.borderColor = "#e63946")}
                onBlur={(e) => (e.target.style.borderColor = "#e8e8e8")}
              />
            </div>
            <div style={s.field}>
              <span style={s.label}>Departure</span>
              <input
                style={s.input}
                type="date"
                value={date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            {tripType === "ROUND_TRIP" && (
              <div style={s.field}>
                <span style={s.label}>Return</span>
                <input
                  style={s.input}
                  type="date"
                  value={returnDate}
                  min={date || new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
            )}
            <button style={s.searchBtn} onClick={searchFlights}>🔍 Search</button>
          </div>
          {msg && <div style={{ ...s.alert("error"), marginTop: 12, marginBottom: 0 }}>{msg}</div>}
        </div>
      </div>

      {/* Popular routes */}
      <div style={s.main}>
        <h2 style={s.sectionTitle}>🔥 Popular Routes</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { from: "DEL", to: "BOM", price: "₹2,999" },
            { from: "BOM", to: "BLR", price: "₹1,899" },
            { from: "DEL", to: "MAA", price: "₹3,499" },
            { from: "HYD", to: "CCU", price: "₹2,299" },
            { from: "BLR", to: "DEL", price: "₹2,799" },
            { from: "MAA", to: "BOM", price: "₹2,199" },
          ].map((r) => (
            <div
              key={`${r.from}-${r.to}`}
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: 16,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                border: "1px solid #f0f0f0",
                transition: "transform 0.15s",
              }}
              onClick={() => { setOrigin(r.from); setDest(r.to); }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: "#222" }}>{r.from} → {r.to}</div>
              <div style={{ fontSize: 13, color: "#e63946", fontWeight: 700, marginTop: 4 }}>From {r.price}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderResults = () => (
    <div style={s.main}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={s.sectionTitle}>
          ✈ {origin} ↔ {dest}
          {tripType === "ONE_WAY" && <span style={{ fontSize: 14, fontWeight: 400, color: "#888" }}>· {flights.length} flights found</span>}
        </h2>
        <button
          style={{ ...s.bookBtn, background: "#f5f5f5", color: "#666", boxShadow: "none", border: "1px solid #ddd" }}
          onClick={() => { setPage("home"); setFlights([]); setOutboundFlights([]); setReturnFlights([]); setMsg(""); }}
        >
          ← Modify Search
        </button>
      </div>
      {loading && <Spinner />}
      {msg && <div style={s.alert("error")}>{msg}</div>}

      {tripType === "ONE_WAY" ? (
        flights.map((f) => <FlightCard key={f.flightId} flight={f} onBook={handleBook} />)
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, paddingBottom: 80 }}>
          <div>
            <h3 style={{ marginBottom: 12, fontSize: 16 }}>🛫 Outbound</h3>
            {outboundFlights.map((f) => (
              <div key={f.flightId} style={{ border: selectedOutbound?.flightId === f.flightId ? "2px solid #e63946" : "2px solid transparent", borderRadius: 14 }}>
                <FlightCard flight={f} onBook={(fl) => setSelectedOutbound(fl)} />
              </div>
            ))}
            {outboundFlights.length === 0 && !loading && <div style={{ color: "#999", fontSize: 13 }}>No outbound flights.</div>}
          </div>
          <div>
            <h3 style={{ marginBottom: 12, fontSize: 16 }}>🛬 Return</h3>
            {returnFlights.map((f) => (
              <div key={f.flightId} style={{ border: selectedReturn?.flightId === f.flightId ? "2px solid #e63946" : "2px solid transparent", borderRadius: 14 }}>
                <FlightCard flight={f} onBook={(fl) => setSelectedReturn(fl)} />
              </div>
            ))}
            {returnFlights.length === 0 && !loading && <div style={{ color: "#999", fontSize: 13 }}>No return flights.</div>}
          </div>
        </div>
      )}

      {tripType === "ROUND_TRIP" && selectedOutbound && selectedReturn && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", padding: "16px 24px", boxShadow: "0 -4px 20px rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 100 }}>
          <div>
            <div style={{ fontSize: 14, color: "#666", fontWeight: 600 }}>Selected Round Trip</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#e63946" }}>
              ₹{selectedOutbound.basePrice + selectedReturn.basePrice} <span style={{ fontSize: 12, fontWeight: 600, color: "#999" }}>total base fare</span>
            </div>
          </div>
          <button style={s.bookBtn} onClick={() => handleBook([selectedOutbound, selectedReturn])}>
            Book Round Trip
          </button>
        </div>
      )}
    </div>
  );

  const renderBookings = () => (
    <div style={s.main}>
      <h2 style={s.sectionTitle}>🎫 My Bookings</h2>
      {loading && <Spinner />}
      {msg && <div style={s.alert("error")}>{msg}</div>}
      {!loading && bookings.length === 0 && (
        <div style={s.emptyState}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🛫</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No bookings yet</div>
          <div style={{ fontSize: 14, color: "#bbb", marginBottom: 20 }}>Your upcoming trips will appear here</div>
          <button style={s.bookBtn} onClick={() => setPage("home")}>Search Flights</button>
        </div>
      )}
      {bookings.map((b) => (
        <div 
          key={b.bookingId} 
          style={{ ...s.bookingCard, cursor: "pointer", transition: "all 0.2s" }}
          onClick={() => openReceipt(b)}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "none"; }}
        >
          <div>
            <div style={s.pnr}>{b.pnrCode}</div>
            <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>Booking ID: {b.bookingId?.slice(0, 8)}...</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: "#666" }}>Flight #{b.flightId}</div>
            <div style={{ fontSize: 12, color: "#999" }}>{b.tripType?.replace("_", " ")}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#999" }}>Meal: {b.mealPreference}</div>
            <div style={{ fontSize: 12, color: "#999" }}>Luggage: {b.luggageKg} kg</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ ...s.badge(b.status === "CONFIRMED" ? "green" : b.status === "CANCELLED" ? "red" : "orange"), display: "inline-block", marginBottom: 8 }}>
              {b.status}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#e63946" }}>₹{b.totalFare}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProfile = () => {
    if (!user) return (
      <div style={{ ...s.emptyState, padding: "80px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Sign in to view your profile</div>
        <button style={s.bookBtn} onClick={() => setAuthModal("login")}>Sign In</button>
      </div>
    );
    const name = user?.firstName || user?.FirstName || user?.email?.split("@")[0] || "User";
    const email = user?.email || user?.Email || "";
    const initial = name[0]?.toUpperCase() || "U";
    return (
      <div style={s.main}>
        <div style={s.profileCard}>
          <div style={s.avatar}>{initial}</div>
          <h2 style={{ textAlign: "center", margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>{name}</h2>
          <p style={{ textAlign: "center", color: "#999", fontSize: 13, margin: "0 0 24px" }}>{email}</p>
          <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 20 }}>
            {[
              { label: "User ID", value: user?.userId || user?.id || "-" },
              { label: "Phone", value: user?.phoneNumber || user?.phone || "-" },
              { label: "Role", value: user?.role || user?.Role || "CUSTOMER" },
            ].map((r) => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f8f8f8" }}>
                <span style={{ fontSize: 13, color: "#999" }}>{r.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#333", maxWidth: "60%", wordBreak: "break-all", textAlign: "right" }}>{r.value}</span>
              </div>
            ))}
          </div>
          <button
            style={{ ...s.submitBtn, background: "#f5f5f5", color: "#e63946", border: "2px solid #e63946", boxShadow: "none", marginTop: 20 }}
            onClick={logout}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={s.app}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} body{background:#f5f5f5}`}</style>

      {/* Navbar */}
      <nav style={s.nav}>
        <div style={s.logo} onClick={() => setPage("home")}>
          Sky<span style={s.logoSpan}>Booker</span> ✈
        </div>
        <div style={s.navLinks}>
          <button style={s.navBtn(page === "home")} onClick={() => setPage("home")}>Home</button>
          <button style={s.navBtn(page === "bookings")} onClick={() => { setPage("bookings"); }}>My Trips</button>
          <button style={s.navBtn(page === "profile")} onClick={() => setPage("profile")}>Profile</button>
          {(user?.role === "ADMIN" || user?.role === "AIRLINE_STAFF") && (
            <button style={s.navBtn(page === "admin")} onClick={() => setPage("admin")}>
              {user?.role === "ADMIN" ? "🛡️ Admin" : "✈️ Staff"}
            </button>
          )}
          {!user ? (
            <>
              <button style={{ ...s.navBtn(false), background: "rgba(255,255,255,0.15)" }} onClick={() => setAuthModal("login")}>Sign In</button>
              <button style={{ ...s.navBtn(false), background: "#ffd60a", color: "#c1121f", fontWeight: 800, border: "none" }} onClick={() => setAuthModal("register")}>Register</button>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, border: "2px solid rgba(255,255,255,0.5)", cursor: "pointer" }} onClick={() => setPage("profile")}>
                {(user?.firstName || user?.email || "U")[0].toUpperCase()}
              </div>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>{user?.firstName || user?.email?.split("@")[0]}</span>
            </div>
          )}
        </div>
      </nav>

      {/* Pages */}
      {page === "home" && renderHome()}
      {page === "results" && renderResults()}
      {page === "bookings" && renderBookings()}
      {page === "profile" && renderProfile()}
      {page === "admin" && (user?.role === "ADMIN" || user?.role === "AIRLINE_STAFF") && (
        <ManagementDashboard role={user?.role} />
      )}

      {/* Modals */}
      {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onSuccess={onAuthSuccess} />}
      {bookingFlight && <BookingModal flight={bookingFlight} onClose={() => setBookingFlight(null)} onBooked={onBooked} />}
      {selectedReceipt && <ReceiptModal booking={selectedReceipt} onClose={() => setSelectedReceipt(null)} />}
    </div>
  );
}
