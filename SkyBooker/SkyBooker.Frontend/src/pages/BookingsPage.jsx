import Spinner from '../components/Spinner';
import { s } from '../styles';
import { fmtPrice } from '../api';

export default function BookingsPage({ bookings, loading, msg, onSearchFlights }) {
  const statusType = (status) =>
    status === 'CONFIRMED' ? 'success' :
    status === 'CANCELLED' ? 'error'   : 'warning';

  return (
    <div style={s.main}>
      <h2 style={s.sectionTitle}>🎫 My Trips</h2>

      {loading && <Spinner />}
      {msg && <div style={s.alert('error')}>{msg}</div>}

      {!loading && bookings.length === 0 && (
        <div style={s.emptyState}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🛫</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No bookings yet</div>
          <div style={{ fontSize: 14, color: '#bbb', marginBottom: 20 }}>
            Your upcoming trips will appear here
          </div>
          <button style={s.btn} onClick={onSearchFlights}>Search Flights</button>
        </div>
      )}

      {bookings.map((b) => (
        <div key={b.bookingId} style={{
          ...s.card,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr auto',
          gap: 16,
          alignItems: 'center',
        }}>
          {/* PNR */}
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#e63946', fontFamily: 'monospace', letterSpacing: 2 }}>
              {b.pnrCode}
            </div>
            <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
              Booking: {b.bookingId?.slice(0, 8)}…
            </div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              Flight #{b.flightId}
            </div>
          </div>

          {/* Trip info */}
          <div style={{ fontSize: 13, color: '#666', lineHeight: 2 }}>
            <div>Type: <strong>{b.tripType?.replace('_', ' ')}</strong></div>
            <div>Meal: <strong>{b.mealPreference}</strong></div>
            <div>Luggage: <strong>{b.luggageKg} kg</strong></div>
          </div>

          {/* Contact */}
          <div style={{ fontSize: 12, color: '#888', lineHeight: 2 }}>
            <div>📧 {b.contactEmail}</div>
            <div>📱 {b.contactPhone}</div>
          </div>

          {/* Status + fare */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ ...s.badge(statusType(b.status)), marginBottom: 8 }}>
              {b.status}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#e63946' }}>
              {fmtPrice(b.totalFare)}
            </div>
            <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
              Base: {fmtPrice(b.baseFare)} + Tax: {fmtPrice(b.taxes)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
