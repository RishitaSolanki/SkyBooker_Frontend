import { useState } from 'react';
import { API, apiFetch, fmtDur, fmtPrice } from '../api';
import { s } from '../styles';

export default function BookingModal({ flight, onClose, onBooked }) {
  const [form, setForm] = useState({
    contactEmail: '',
    contactPhone: '',
    mealPreference: 'Veg',
    luggageKg: 15,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('sb_user') || '{}');
  const set  = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const baseFare = parseFloat(flight.basePrice) || 0;
  const taxes    = +(baseFare * 0.18).toFixed(2);
  const total    = +(baseFare + taxes).toFixed(2);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const booking = await apiFetch(`${API.booking}`, {
        method: 'POST',
        body: JSON.stringify({
          userId:          user?.userId || user?.id || user?.Id || 'guest',
          flightId:        flight.flightId,
          tripType:        'ONE_WAY',
          baseFare,
          taxes,
          totalFare:       total,
          contactEmail:    form.contactEmail,
          contactPhone:    form.contactPhone,
          mealPreference:  form.mealPreference,
          luggageKg:       parseInt(form.luggageKg),
        }),
      });
      onBooked(booking);
    } catch {
      setError('Booking failed. Please ensure you are logged in and try again.');
    }
    setLoading(false);
  }

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <button style={s.closeBtn} onClick={onClose}>✕</button>
        <h2 style={s.modalTitle}>✈️ Complete Booking</h2>

        {/* Flight summary */}
        <div style={{
          background: '#fff5f5',
          borderRadius: 10,
          padding: 16,
          marginBottom: 20,
          border: '1px solid #ffd0d0',
        }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{flight.airlineName} · {flight.flightNumber}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#222' }}>
            {flight.originAirportCode} → {flight.destinationAirportCode}
          </div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
            {new Date(flight.departureTime).toLocaleString('en-IN')} · {fmtDur(flight.durationMinutes)}
          </div>

          <div style={{
            marginTop: 12,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 8,
            paddingTop: 12,
            borderTop: '1px dashed #f0c0c0',
          }}>
            <div>
              <div style={{ fontSize: 11, color: '#999' }}>Base Fare</div>
              <div style={{ fontWeight: 700 }}>{fmtPrice(baseFare)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#999' }}>Taxes (18%)</div>
              <div style={{ fontWeight: 700 }}>{fmtPrice(taxes)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#999' }}>Total</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#e63946' }}>{fmtPrice(total)}</div>
            </div>
          </div>
        </div>

        {error && <div style={s.alert('error')}>{error}</div>}

        <form onSubmit={submit}>
          <div style={s.formGroup}>
            <label style={s.formLabel}>Contact Email</label>
            <input
              style={s.formInput}
              type="email"
              value={form.contactEmail}
              onChange={set('contactEmail')}
              placeholder="you@example.com"
              required
            />
          </div>

          <div style={s.formGroup}>
            <label style={s.formLabel}>Contact Phone</label>
            <input
              style={s.formInput}
              value={form.contactPhone}
              onChange={set('contactPhone')}
              placeholder="+91 98765 43210"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={s.formGroup}>
              <label style={s.formLabel}>Meal Preference</label>
              <select style={s.formInput} value={form.mealPreference} onChange={set('mealPreference')}>
                <option>Veg</option>
                <option>Non-Veg</option>
                <option>Vegan</option>
                <option>Jain</option>
                <option>No Meal</option>
              </select>
            </div>

            <div style={s.formGroup}>
              <label style={s.formLabel}>Luggage (kg)</label>
              <select style={s.formInput} value={form.luggageKg} onChange={set('luggageKg')}>
                {[15, 20, 25, 30].map((k) => (
                  <option key={k} value={k}>{k} kg</option>
                ))}
              </select>
            </div>
          </div>

          <button style={s.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Processing...' : `Confirm & Pay ${fmtPrice(total)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
