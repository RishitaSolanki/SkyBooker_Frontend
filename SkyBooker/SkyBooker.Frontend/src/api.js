// ─── Backend Service URLs ────────────────────────────────────────────────────
// Update these ports if your backend runs on different ports
export const API = {
  auth:       'http://localhost:5010/api/auth',
  flight:     'http://localhost:5001/api/flight',
  booking:    'http://localhost:5214/api/booking',
  seat:       'http://localhost:5002/api/seat',
  passenger:  'http://localhost:5290/api/passenger',
  payment:    'http://localhost:5087/api/payment',
  notification: 'http://localhost:5006/api/notification',
  airline:    'http://localhost:5008/api/airlines',
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
