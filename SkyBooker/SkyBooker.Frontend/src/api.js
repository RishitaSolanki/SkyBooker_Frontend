// ─── Backend Service URLs ────────────────────────────────────────────────────
// Update these ports if your backend runs on different ports
export const API = {
  auth:       'https://skybooker-auth-la7d.onrender.com/api/auth',
  flight:     'https://skybooker-flight-x36m.onrender.com/api/flight',
  booking:    'https://skybooker-booking-2ws8.onrender.com/api/booking',
  seat:       'https://skybooker-seat-ejtb.onrender.com/api/seat',
  passenger:  'https://skybooker-passenger-l9dl.onrender.com/api/passenger',
  payment:    'https://skybooker-payment-qy5w.onrender.com/api/payment',
  notification: 'https://skybooker-notification-o6ak.onrender.com/api/notification',
  airline:    'https://skybooker-airline-5xwu.onrender.com/api/airlines',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem('sb_token');
export const getUser  = () => {
  const u = localStorage.getItem('sb_user');
  return u ? JSON.parse(u) : null;
};
export const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export async function apiFetch(url, opts = {}) {
  const { headers, ...restOpts } = opts;
  const res = await fetch(url, {
    ...restOpts,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...headers,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export const fmtDate = (d) =>
  new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

export const fmtDur = (min) => `${Math.floor(min / 60)}h ${min % 60}m`;

export const fmtPrice = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
