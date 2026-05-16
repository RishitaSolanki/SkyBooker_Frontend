// ─── Backend Service URLs ────────────────────────────────────────────────────
// Update these ports if your backend runs on different ports
export const API = {
  auth:         import.meta.env.VITE_API_AUTH         || 'http://localhost:5010/api/auth',
  flight:       import.meta.env.VITE_API_FLIGHT       || 'http://localhost:5001/api/flight',
  booking:      import.meta.env.VITE_API_BOOKING      || 'http://localhost:5214/api/booking',
  seat:         import.meta.env.VITE_API_SEAT         || 'http://localhost:5002/api/seat',
  passenger:    import.meta.env.VITE_API_PASSENGER    || 'http://localhost:5290/api/passenger',
  payment:      import.meta.env.VITE_API_PAYMENT      || 'http://localhost:5087/api/payment',
  notification: import.meta.env.VITE_API_NOTIFICATION || 'http://localhost:5006/api/notification',
  airline:      import.meta.env.VITE_API_AIRLINE      || 'http://localhost:5008/api/airlines',
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
