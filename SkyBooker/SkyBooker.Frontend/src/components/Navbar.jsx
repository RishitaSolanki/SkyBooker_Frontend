import { s, colors } from '../styles';

export default function Navbar({ page, setPage, user, onLoginClick, onRegisterClick }) {
  const name = user?.firstName || user?.FirstName || user?.email?.split('@')[0] || 'U';
  const initial = name[0]?.toUpperCase() || 'U';

  return (
    <nav style={s.nav}>
      <div style={s.logo} onClick={() => setPage('home')}>
        Sky<span style={s.logoAccent}>Booker</span> ✈
      </div>

      <div style={s.navLinks}>
        <button style={s.navBtn(page === 'home')} onClick={() => setPage('home')}>Home</button>
        <button style={s.navBtn(page === 'bookings')} onClick={() => setPage('bookings')}>My Trips</button>
        <button style={s.navBtn(page === 'profile')} onClick={() => setPage('profile')}>Profile</button>

        {!user ? (
          <>
            <button
              style={{ ...s.navBtn(false), background: 'rgba(255,255,255,0.15)' }}
              onClick={onLoginClick}
            >
              Sign In
            </button>
            <button
              style={{
                ...s.navBtn(false),
                background: colors.accent,
                color: colors.primaryDark,
                fontWeight: 800,
                border: 'none',
              }}
              onClick={onRegisterClick}
            >
              Register
            </button>
          </>
        ) : (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
            onClick={() => setPage('profile')}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: colors.white, fontWeight: 800, fontSize: 14,
              border: '2px solid rgba(255,255,255,0.5)',
            }}>
              {initial}
            </div>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>{name}</span>
          </div>
        )}
      </div>
    </nav>
  );
}
