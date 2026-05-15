import { s } from '../styles';
import { fmtDate, fmtDur, fmtPrice } from '../api';

export default function FlightCard({ flight, onBook }) {
  const statusType =
    flight.status === 'SCHEDULED' ? 'success' :
    flight.status === 'CANCELLED' ? 'error' : 'warning';

  return (
    <div
      style={{
        ...s.card,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr auto',
        gap: 16,
        alignItems: 'center',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      {/* Route */}
      <div>
        <div style={{ fontSize: 12, color: '#999', fontWeight: 600, marginBottom: 6 }}>
          {flight.airlineName} · {flight.flightNumber}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#222' }}>
              {flight.originAirportCode}
            </div>
            <div style={{ fontSize: 11, color: '#999' }}>
              {new Date(flight.departureTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>
              {fmtDur(flight.durationMinutes)}
            </div>
            <div style={{ width: '100%', height: 1, background: '#ddd', position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '50%', top: -8,
                transform: 'translateX(-50%)',
                color: '#e63946', fontSize: 16,
              }}>✈</span>
            </div>
            <div style={{ fontSize: 10, color: '#bbb' }}>Non-stop</div>
          </div>

          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#222' }}>
              {flight.destinationAirportCode}
            </div>
            <div style={{ fontSize: 11, color: '#999' }}>
              {new Date(flight.arrivalTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div>
        <div style={{ marginBottom: 8 }}>
          <span style={s.badge(statusType)}>{flight.status}</span>
        </div>
        <div style={{ fontSize: 12, color: '#666', lineHeight: 1.8 }}>
          <span>Aircraft: <strong>{flight.aircraftType}</strong></span><br />
          <span>Seats left: </span>
          <strong style={{ color: flight.availableSeats < 10 ? '#e63946' : '#333' }}>
            {flight.availableSeats}
          </strong>
        </div>
      </div>

      {/* Date */}
      <div>
        <div style={{ fontSize: 11, color: '#999', marginBottom: 2 }}>Departure</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 8 }}>
          {fmtDate(flight.departureTime)}
        </div>
        <div style={{ fontSize: 11, color: '#999', marginBottom: 2 }}>Arrival</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>
          {fmtDate(flight.arrivalTime)}
        </div>
      </div>

      {/* Price */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 11, color: '#999', marginBottom: 2 }}>per person</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#e63946', marginBottom: 10 }}>
          {fmtPrice(flight.basePrice)}
        </div>
        <button
          style={s.btn}
          onClick={() => onBook(flight)}
          disabled={flight.availableSeats === 0 || flight.status === 'CANCELLED'}
        >
          {flight.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
        </button>
      </div>
    </div>
  );
}
