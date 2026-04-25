import React, { useState } from 'react';
import { theme } from '../theme/colors';
import { apiFetch } from '../api';

const c = theme.colors;
const ROLES = ['Parent', 'Spouse', 'Child', 'Sibling'];

export default function AuthPage({ onLogin, onBack }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (isRegister && !name.trim()) { setError('Please enter your name.'); return; }
    setLoading(true);
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const body = isRegister
        ? { name: name.trim(), email, password, role }
        : { email, password };
      const res = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Authentication failed');
      }
      const data = await res.json();
      if (data.access_token) localStorage.setItem('resonance_token', data.access_token);
      onLogin({ name: data.name || (isRegister ? name.trim() : email.split('@')[0]), email, role: data.role || role });
    } catch (err) {
      if (err.message.includes('fetch') || err.message.includes('Failed') || err.message.includes('NetworkError')) {
        // Backend unreachable — allow demo login
        onLogin({ name: isRegister ? name.trim() : email.split('@')[0], email, role });
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    background: c.bgCard, border: `1px solid ${c.border}`,
    borderRadius: '2px', color: c.textPrimary,
    fontSize: '0.88rem', outline: 'none',
    marginBottom: '1rem', transition: 'border-color 0.2s',
  };
  const labelStyle = {
    fontSize: '0.7rem', letterSpacing: '1.5px', color: c.textMuted,
    textTransform: 'uppercase', display: 'block', marginBottom: '6px',
  };

  return (
    <div style={{ background: c.bg, minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: '-10%', top: '20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(92,138,58,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <button onClick={onBack} style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'transparent', border: 'none', color: c.textMuted, fontSize: '0.75rem', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'color 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = c.textSecondary}
        onMouseLeave={e => e.currentTarget.style.color = c.textMuted}>
        ← Back
      </button>

      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', borderRight: `1px solid ${c.border}`, background: c.bgMid }}>
        <div style={{ textAlign: 'center', maxWidth: '360px' }}>
          <h1 style={{ fontFamily: theme.fonts.serif, fontSize: '3.5rem', fontWeight: 300, letterSpacing: '10px', color: c.bone, marginBottom: '0.5rem' }}>RESONANCE</h1>
          <p style={{ fontFamily: theme.fonts.serif, fontStyle: 'italic', color: c.textSecondary, fontSize: '0.95rem', marginBottom: '3rem' }}>you care for them, we care for you</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { icon: '✦', text: 'Track your burnout before it burns you out' },
              { icon: '◈', text: "A private journal that holds what you can't say aloud" },
              { icon: '⬡', text: 'A companion who understands the invisible weight' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', textAlign: 'left' }}>
                <span style={{ color: c.gold, fontSize: '0.9rem', marginTop: '2px', flexShrink: 0 }}>{item.icon}</span>
                <p style={{ fontSize: '0.85rem', color: c.textSecondary, lineHeight: 1.6 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h2 style={{ fontFamily: theme.fonts.serif, fontSize: '1.6rem', fontWeight: 400, color: c.bone, marginBottom: '0.35rem' }}>
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: c.textMuted, marginBottom: '2rem' }}>
            {isRegister ? 'A safe space, just for caretakers' : 'Sign in to continue your journey'}
          </p>

          {isRegister && (
            <>
              <label style={labelStyle}>Your first name</label>
              <input style={inputStyle} placeholder="e.g. Priya" value={name} onChange={e => setName(e.target.value)}
                onFocus={e => e.target.style.borderColor = c.borderLight}
                onBlur={e => e.target.style.borderColor = c.border} />
              <label style={labelStyle}>I am caring for a</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                {ROLES.map(r => (
                  <button key={r} onClick={() => setRole(r)} style={{
                    flex: 1, padding: '8px 4px',
                    border: `1px solid ${role === r ? c.gold : c.border}`,
                    borderRadius: '2px', fontSize: '0.75rem',
                    background: role === r ? 'rgba(201,168,76,0.15)' : 'transparent',
                    color: role === r ? c.gold : c.textSecondary, transition: 'all 0.15s',
                  }}>{r}</button>
                ))}
              </div>
            </>
          )}

          <label style={labelStyle}>Email</label>
          <input style={inputStyle} type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)}
            onFocus={e => e.target.style.borderColor = c.borderLight}
            onBlur={e => e.target.style.borderColor = c.border} />

          <label style={labelStyle}>Password</label>
          <input style={inputStyle} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            onFocus={e => e.target.style.borderColor = c.borderLight}
            onBlur={e => e.target.style.borderColor = c.border} />

          {error && (
            <p style={{ color: c.danger, fontSize: '0.8rem', marginBottom: '1rem', padding: '0.6rem', background: 'rgba(181,64,64,0.1)', border: `1px solid rgba(181,64,64,0.3)`, borderRadius: '2px' }}>
              {error}
            </p>
          )}

          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', padding: '0.85rem', background: c.bgCard,
            border: `1px solid ${c.borderLight}`, borderRadius: '2px',
            color: loading ? c.textMuted : c.bone, fontSize: '0.82rem',
            letterSpacing: '2px', textTransform: 'uppercase', transition: 'all 0.2s', marginBottom: '1.25rem',
          }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = c.gold; e.currentTarget.style.color = c.gold; } }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = c.borderLight; e.currentTarget.style.color = loading ? c.textMuted : c.bone; }}>
            {loading ? 'Please wait…' : (isRegister ? 'Create account' : 'Sign in')}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: c.textMuted }}>
            {isRegister ? 'Already have an account? ' : 'No account? '}
            <span onClick={() => { setIsRegister(!isRegister); setError(''); }} style={{ color: c.textSecondary, cursor: 'pointer', borderBottom: `1px solid ${c.border}` }}>
              {isRegister ? 'Sign in' : 'Create one'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
