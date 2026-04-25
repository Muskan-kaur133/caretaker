import React, { useState, useEffect } from 'react';
import { theme } from '../theme/colors';

const c = theme.colors;

export default function LandingPage({ onGetStarted, onLogin }) {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: c.bg, minHeight: '100vh', overflowX: 'hidden' }}>
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '1.2rem 2.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(26,43,20,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${c.border}` : 'none',
        transition: 'all 0.3s ease',
      }}>
        <span style={{ fontFamily: theme.fonts.serif, fontSize: '1.3rem', letterSpacing: '6px', color: c.bone, fontWeight: 300 }}>
          RESONANCE
        </span>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#about" style={{ fontSize: '0.78rem', letterSpacing: '2px', color: c.textSecondary, textTransform: 'uppercase', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = c.bone}
            onMouseLeave={e => e.target.style.color = c.textSecondary}>About</a>
          <a href="#journal" style={{ fontSize: '0.78rem', letterSpacing: '2px', color: c.textSecondary, textTransform: 'uppercase', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = c.bone}
            onMouseLeave={e => e.target.style.color = c.textSecondary}>Journal</a>
          <button onClick={onLogin} style={{
            padding: '0.5rem 1.4rem',
            border: `1px solid ${c.border}`,
            borderRadius: '20px', background: 'transparent',
            color: c.bone, fontSize: '0.78rem', letterSpacing: '1px',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.target.style.background = c.bgCard; e.target.style.borderColor = c.borderLight; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = c.border; }}>
            Sign In
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', padding: '0 2.5rem' }}>
        {/* Background texture circles */}
        <div style={{
          position: 'absolute', right: '5%', top: '15%',
          width: '480px', height: '480px',
          background: 'radial-gradient(circle, rgba(92,138,58,0.12) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: '8%', top: '12%',
          width: '420px', height: '420px',
          border: `1px solid rgba(93,138,58,0.15)`,
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        {/* Illustration oval */}
        <div style={{
          position: 'absolute', right: '6%', top: '50%',
          transform: 'translateY(-50%)',
          width: '380px', height: '460px',
          background: 'radial-gradient(ellipse at center, #2A4A1A 0%, #1e3a12 100%)',
          borderRadius: '50% 50% 50% 50%',
          border: `1px solid ${c.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {/* SVG illustration placeholder */}
          <svg viewBox="0 0 200 260" width="200" height="260" style={{ opacity: 0.9 }}>
            {/* Person in wheelchair */}
            <circle cx="130" cy="80" r="22" fill="#C4956A" />
            <path d="M108 102 Q130 95 152 102 L158 160 L102 160 Z" fill="#8B6914" />
            {/* Wheelchair */}
            <circle cx="110" cy="185" r="18" fill="none" stroke="#6B8055" strokeWidth="3" />
            <circle cx="150" cy="185" r="18" fill="none" stroke="#6B8055" strokeWidth="3" />
            <path d="M95 150 L100 180 L160 180 L165 150" fill="none" stroke="#6B8055" strokeWidth="3" />
            <path d="M110 150 L140 150" stroke="#6B8055" strokeWidth="3" />
            {/* Caretaker standing behind */}
            <circle cx="75" cy="88" r="20" fill="#D4A882" />
            <path d="M55 108 Q75 100 95 108 L100 175 L50 175 Z" fill="#C9A84C" />
            {/* Thought bubble */}
            <circle cx="55" cy="55" r="3" fill="rgba(197,218,170,0.6)" />
            <circle cx="47" cy="46" r="5" fill="rgba(197,218,170,0.6)" />
            <ellipse cx="38" cy="32" rx="18" ry="12" fill="rgba(197,218,170,0.4)" stroke="rgba(197,218,170,0.5)" strokeWidth="1" />
            <text x="28" y="36" fontSize="9" fill="#A8BF90">💭</text>
          </svg>
        </div>

        {/* Hero text */}
        <div style={{
          maxWidth: '560px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <p style={{ fontSize: '0.72rem', letterSpacing: '3px', color: c.textSecondary, textTransform: 'uppercase', marginBottom: '1.2rem' }}>
            For the invisible patient
          </p>
          <h1 style={{
            fontFamily: theme.fonts.serif,
            fontSize: 'clamp(3.5rem, 7vw, 5.5rem)',
            fontWeight: 300,
            letterSpacing: '8px',
            color: c.bone,
            lineHeight: 1.05,
            marginBottom: '1rem',
          }}>
            RESONANCE
          </h1>
          <p style={{
            fontSize: '1rem',
            color: c.textSecondary,
            letterSpacing: '1px',
            marginBottom: '2.5rem',
            fontStyle: 'italic',
            fontFamily: theme.fonts.serif,
          }}>
            you care for them, we care for you
          </p>

          <p style={{
            fontSize: '0.95rem', color: c.textSecondary,
            lineHeight: 1.85, maxWidth: '440px',
            marginBottom: '2.5rem',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.9s ease 0.3s',
          }}>
            There are millions of family caretakers globally who manage
            the lives of others — be it elderly parents, children with
            disabilities, or spouses with chronic illnesses. While the
            "primary patient" receives medical attention, the caretaker
            often becomes the <em>"Second Patient,"</em> suffering from extreme
            emotional exhaustion, isolation, and burnout.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={onGetStarted} style={{
              padding: '0.85rem 2.2rem',
              background: c.bgCard,
              border: `1px solid ${c.borderLight}`,
              borderRadius: '2px',
              color: c.bone,
              fontSize: '0.82rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              transition: 'all 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = c.bgCardHover; e.currentTarget.style.borderColor = c.gold; e.currentTarget.style.color = c.gold; }}
              onMouseLeave={e => { e.currentTarget.style.background = c.bgCard; e.currentTarget.style.borderColor = c.borderLight; e.currentTarget.style.color = c.bone; }}>
              Begin →
            </button>
            <button onClick={onLogin} style={{
              padding: '0.85rem 2.2rem',
              background: 'transparent',
              border: `1px solid ${c.border}`,
              borderRadius: '2px',
              color: c.textSecondary,
              fontSize: '0.82rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              transition: 'all 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.borderLight; e.currentTarget.style.color = c.textPrimary; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSecondary; }}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="about" style={{ padding: '5rem 2.5rem', borderTop: `1px solid ${c.border}` }}>
        <p style={{ fontSize: '0.72rem', letterSpacing: '3px', color: c.textMuted, textTransform: 'uppercase', textAlign: 'center', marginBottom: '3rem' }}>
          What Resonance offers
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { icon: '✦', title: 'Burnout Tracking', desc: 'A personal burnout score that understands the invisible weight you carry every day.' },
            { icon: '◈', title: 'Private Journal', desc: 'Your words are yours alone. Write freely in an encrypted space that listens without judgment.' },
            { icon: '⬡', title: 'AI Companion', desc: 'Warm, grounded support available whenever you need to process your feelings.' },
            { icon: '◉', title: 'Peer Groups', desc: 'Connect with others who understand the caretaker journey without needing explanation.' },
          ].map((f, i) => (
            <div key={i} style={{
              padding: '1.5rem',
              border: `1px solid ${c.border}`,
              borderRadius: '2px',
              background: c.bgCard,
              transition: 'all 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.borderLight; e.currentTarget.style.background = c.bgCardHover; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.background = c.bgCard; }}>
              <div style={{ fontSize: '1.2rem', color: c.gold, marginBottom: '0.75rem' }}>{f.icon}</div>
              <h3 style={{ fontFamily: theme.fonts.serif, fontSize: '1.05rem', color: c.bone, fontWeight: 400, marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.82rem', color: c.textSecondary, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER QUOTE */}
      <section style={{ padding: '4rem 2.5rem 5rem', textAlign: 'center', borderTop: `1px solid ${c.border}` }}>
        <p style={{ fontFamily: theme.fonts.serif, fontSize: '1.4rem', fontStyle: 'italic', color: c.textSecondary, maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
          "You are doing something incredibly hard, and you deserve care too."
        </p>
        <button onClick={onGetStarted} style={{
          padding: '0.9rem 2.5rem',
          background: 'transparent',
          border: `1px solid ${c.borderLight}`,
          borderRadius: '2px',
          color: c.bone,
          fontSize: '0.8rem',
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          transition: 'all 0.25s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = c.bgCard; e.currentTarget.style.borderColor = c.gold; e.currentTarget.style.color = c.gold; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = c.borderLight; e.currentTarget.style.color = c.bone; }}>
          Get Started →
        </button>
        <p style={{ marginTop: '3rem', fontSize: '0.72rem', color: c.textMuted, letterSpacing: '1px' }}>
          © 2025 Resonance · For caretakers everywhere
        </p>
      </section>
    </div>
  );
}
