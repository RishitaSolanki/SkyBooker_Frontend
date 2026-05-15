import FlightCard from '../components/FlightCard';
import Spinner from '../components/Spinner';
import { s } from '../styles';

export default function ResultsPage({ flights, origin, dest, loading, msg, onBook, onBack }) {
  return (
    <div style={s.main}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ ...s.sectionTitle, marginBottom: 0 }}>
          ✈ {origin} → {dest}
          <span style={{ fontSize: 14, fontWeight: 400, color: '#888' }}>
            &nbsp;· {flights.length} flight{flights.length !== 1 ? 's' : ''} found
          </span>
        </h2>
        <button style={s.btnOutline} onClick={onBack}>← Modify Search</button>
      </div>

      {loading && <Spinner />}
      {msg && <div style={s.alert('error')}>{msg}</div>}

      {!loading && flights.length === 0 && !msg && (
        <div style={s.emptyState}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No flights found</div>
          <div style={{ fontSize: 14, color: '#bbb' }}>Try different airports or dates</div>
        </div>
      )}

      {flights.map((f) => (
        <FlightCard key={f.flightId} flight={f} onBook={onBook} />
      ))}
    </div>
  );
}
