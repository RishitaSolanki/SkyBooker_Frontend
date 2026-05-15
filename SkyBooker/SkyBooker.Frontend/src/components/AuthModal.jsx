import { useState } from 'react';
import { API, apiFetch } from '../api';
import { s } from '../styles';

export default function AuthModal({ mode, onClose, onSuccess }) {
  const [form, setForm] = useState({
    email: '', password: '', fullName: '', role: 'User',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        const data = await apiFetch(`${API.auth}/login`, {
          method: 'POST',
          body: JSON.stringify({ email: form.email, password: form.password }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const token = data.token || data.Token || data.accessToken || '';
        const user  = data.user  || data.User  || data;
        localStorage.setItem('sb_token', token);
        localStorage.setItem('sb_user', JSON.stringify(user));
        onSuccess(user);
      } else {
        await apiFetch(`${API.auth}/register`, {
          method: 'POST',
          body: JSON.stringify({
            fullName: form.fullName,
            email: form.email,
            password: form.password,
            role: form.role,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        alert('✅ Registered successfully! Please log in.');
        onClose();
      }
    } catch {
      setError(
        mode === 'login'
          ? 'Invalid credentials. Please try again.'
          : 'Registration failed. Email may already be in use.'
      );
    }
    setLoading(false);
  }

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <button style={s.closeBtn} onClick={onClose}>✕</button>

        <h2 style={s.modalTitle}>
          {mode === 'login' ? '🔐 Welcome Back' : '✈️ Join SkyBooker'}
        </h2>

        {error && <div style={s.alert('error')}>{error}</div>}

        <form onSubmit={submit}>
          {mode === 'register' && (
            <div style={s.formGroup}>
              <label style={s.formLabel}>Full Name</label>
              <input
                style={s.formInput}
                value={form.fullName}
                onChange={set('fullName')}
                placeholder="John Doe"
                required
              />
            </div>
          )}

          {mode === 'register' && (
            <div style={s.formGroup}>
              <label style={s.formLabel}>Role</label>
              <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="role"
                    value="User"
                    checked={form.role === 'User'}
                    onChange={set('role')}
                    style={{ marginRight: 6 }}
                  />
                  <span style={{ fontSize: 14 }}>User</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="role"
                    value="ADMIN"
                    checked={form.role === 'ADMIN'}
                    onChange={set('role')}
                    style={{ marginRight: 6 }}
                  />
                  <span style={{ fontSize: 14 }}>Admin</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="role"
                    value="AIRLINE_STAFF"
                    checked={form.role === 'AIRLINE_STAFF'}
                    onChange={set('role')}
                    style={{ marginRight: 6 }}
                  />
                  <span style={{ fontSize: 14 }}>Airline Staff</span>
                </label>
              </div>
            </div>
          )}

          <div style={s.formGroup}>
            <label style={s.formLabel}>Email Address</label>
            <input
              style={s.formInput}
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="john@example.com"
              required
            />
          </div>

          <div style={s.formGroup}>
            <label style={s.formLabel}>Password</label>
            <input
              style={s.formInput}
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder="••••••••"
              required
            />
          </div>

          
          <button style={s.submitBtn} type="submit" disabled={loading}>
            {loading
              ? 'Please wait...'
              : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#999' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span
            style={{ color: '#e63946', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => onClose(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Register' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
}
