import { s } from '../styles';

const POPULAR_ROUTES = [
  { from: 'DEL', to: 'BOM', label: 'Delhi → Mumbai',   price: '₹2,999' },
  { from: 'BOM', to: 'BLR', label: 'Mumbai → Bengaluru', price: '₹1,899' },
  { from: 'DEL', to: 'MAA', label: 'Delhi → Chennai',   price: '₹3,499' },
  { from: 'HYD', to: 'CCU', label: 'Hyderabad → Kolkata', price: '₹2,299' },
  { from: 'BLR', to: 'DEL', label: 'Bengaluru → Delhi',  price: '₹2,799' },
  { from: 'MAA', to: 'BOM', label: 'Chennai → Mumbai',  price: '₹2,199' },
];

export default function HomePage({ origin, dest, date, setOrigin, setDest, setDate, onSearch, msg }) {
  return (
    <>
      {/* Hero */}
      <div style={s.hero}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <h1 style={s.heroTitle}>Find Your Perfect Flight</h1>
        <p style={s.heroSub}>Search hundreds of routes · Best fares guaranteed · Book in seconds</p>

        {/* Search Card */}
        <div style={s.searchCard}>
          <div style={s.tabs}>
            <button style={s.tab(true)}>✈ One Way</button>
            <button style={s.tab(false)}>↔ Round Trip</button>
            <button style={s.tab(false)}>✦ Multi-City</button>
          </div>

          <div style={s.searchGrid}>
            <div style={s.field}>
              <span style={s.label}>From</span>
              <input
                style={s.input}
                placeholder="e.g. DEL, BOM, BLR"
                value={origin}
                onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                onFocus={(e) => (e.target.style.borderColor = '#e63946')}
                onBlur={(e)  => (e.target.style.borderColor = '#e8e8e8')}
              />
            </div>

            <button
              style={s.swapBtn}
              onClick={() => { const t = origin; setOrigin(dest); setDest(t); }}
              title="Swap"
            >
              ⇄
            </button>

            <div style={s.field}>
              <span style={s.label}>To</span>
              <input
                style={s.input}
                placeholder="e.g. MAA, HYD, CCU"
                value={dest}
                onChange={(e) => setDest(e.target.value.toUpperCase())}
                onFocus={(e) => (e.target.style.borderColor = '#e63946')}
                onBlur={(e)  => (e.target.style.borderColor = '#e8e8e8')}
              />
            </div>

            <div style={s.field}>
              <span style={s.label}>Departure Date</span>
              <input
                style={s.input}
                type="date"
                value={date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <button style={s.searchBtn} onClick={onSearch}>
              🔍 Search Flights
            </button>
          </div>

          {msg && (
            <div style={{ ...s.alert('error'), marginTop: 12, marginBottom: 0 }}>{msg}</div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={s.main}>
        {/* Popular routes */}
        <h2 style={s.sectionTitle}>🔥 Popular Routes</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12,
          marginBottom: 40,
        }}>
          {POPULAR_ROUTES.map((r) => (
            <div
              key={`${r.from}-${r.to}`}
              style={{
                background: '#fff',
                borderRadius: 10,
                padding: 16,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #f0f0f0',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onClick={() => { setOrigin(r.from); setDest(r.to); }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color: '#222' }}>{r.label}</div>
              <div style={{ fontSize: 13, color: '#e63946', fontWeight: 700, marginTop: 4 }}>From {r.price}</div>
            </div>
          ))}
        </div>

        {/* Why SkyBooker */}
        <h2 style={s.sectionTitle}>💡 Why SkyBooker?</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
        }}>
          {[
            { icon: '🛡️', title: 'Secure Booking', desc: 'Your data & payments are always protected.' },
            { icon: '💰', title: 'Best Prices',    desc: 'Guaranteed lowest fares across all routes.' },
            { icon: '🎫', title: 'Instant PNR',    desc: 'Get your PNR code the moment you book.' },
            { icon: '📱', title: '24/7 Support',   desc: 'We are here whenever you need help.' },
          ].map((f) => (
            <div key={f.title} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
