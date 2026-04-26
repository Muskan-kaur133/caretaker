import React, { useState, useEffect } from 'react';
import { theme } from '../theme/colors';
import { apiFetch } from '../api';
import ScoreGauge from '../components/ScoreGauge';
import JournalPage from './JournalPage';
import ChatPage from './ChatPage';
import PatternsPage from './PatternsPage';
import GroupsPage from './GroupsPage';

const c = theme.colors;

const TABS = [
  { id: 'home', label: 'Home', icon: '◎' },
  { id: 'journal', label: 'Journal', icon: '◈' },
  { id: 'chat', label: 'Talk', icon: '⬡' },
  { id: 'patterns', label: 'Patterns', icon: '✦' },
  { id: 'groups', label: 'Groups', icon: '◉' },
];

export default function DashboardPage({ user, onLogout }) {
  const [tab, setTab] = useState('home');
  const [entries, setEntries] = useState([]);
  const [burnoutData, setBurnoutData] = useState({ score: 42, zone: 'Warning', narrative: '' });
  const [ventText, setVentText] = useState('');
  const [isReleasing, setIsReleasing] = useState(false);

  useEffect(() => { fetchBurnout(); }, []);

  const fetchBurnout = async () => {
    try {
      const res = await apiFetch('/burnout/score');
      if (res.ok) setBurnoutData(await res.json());
    } catch { /* use defaults */ }
  };

  const handleVentRelease = async () => {
    if (!ventText.trim()) return;
    setIsReleasing(true);
    try {
      await apiFetch('/journal/vent', {
        method: 'POST',
        body: JSON.stringify({ content: ventText }),
      });
    } catch { /* silent */ }
    setTimeout(() => { setVentText(''); setIsReleasing(false); fetchBurnout(); }, 1200);
  };

  const initials = (user?.name || 'U').slice(0, 2).toUpperCase();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ background: c.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* TOP NAV */}
      <header style={{ padding: '0.85rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${c.border}`, background: c.bgMid, position: 'sticky', top: 0, zIndex: 50 }}>
        <span style={{ fontFamily: theme.fonts.serif, fontSize: '1.1rem', letterSpacing: '6px', color: c.bone, fontWeight: 300 }}>RESONANCE</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user?.role && <span style={{ fontSize: '0.7rem', letterSpacing: '1.5px', color: c.textMuted, textTransform: 'uppercase' }}>{user.role} caretaker</span>}
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: c.bgCard, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: c.textSecondary }}>{initials}</div>
          <button onClick={onLogout} style={{ background: 'transparent', border: 'none', color: c.textMuted, fontSize: '0.72rem', letterSpacing: '1px', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = c.textSecondary}
            onMouseLeave={e => e.target.style.color = c.textMuted}>Sign out</button>
        </div>
      </header>

      {/* TAB BAR */}
      <div style={{ display: 'flex', justifyContent: 'center', borderBottom: `1px solid ${c.border}`, background: c.bgMid }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '0.75rem 1.4rem', background: 'transparent', border: 'none',
            borderBottom: tab === t.id ? `2px solid ${c.gold}` : '2px solid transparent',
            color: tab === t.id ? c.bone : c.textMuted,
            fontSize: '0.72rem', letterSpacing: '1.5px', textTransform: 'uppercase',
            transition: 'all 0.2s', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}
            onMouseEnter={e => { if (tab !== t.id) e.currentTarget.style.color = c.textSecondary; }}
            onMouseLeave={e => { if (tab !== t.id) e.currentTarget.style.color = c.textMuted; }}>
            <span style={{ fontSize: '0.85rem' }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <main style={{ flex: 1, padding: '1.75rem', maxWidth: '780px', margin: '0 auto', width: '100%' }}>
        {tab === 'home' && (
          <div>
            <div style={{ marginBottom: '1.75rem' }}>
              <h2 style={{ fontFamily: theme.fonts.serif, fontSize: '1.5rem', fontWeight: 300, color: c.bone }}>
                {greeting}, {user?.name || 'friend'}.
              </h2>
              <p style={{ fontSize: '0.82rem', color: c.textMuted, marginTop: '4px' }}>How are you holding up today?</p>
            </div>

            {/* Burnout card */}
            <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: '2px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <ScoreGauge score={burnoutData.score} zone={burnoutData.zone} />
              <div style={{ flex: 1, minWidth: '180px' }}>
                <p style={{ fontSize: '0.7rem', letterSpacing: '1.5px', color: c.textMuted, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Your burnout index</p>
                <p style={{ fontFamily: theme.fonts.serif, fontSize: '1rem', color: c.textSecondary, lineHeight: 1.7, fontStyle: 'italic' }}>
                  {burnoutData.narrative || "Your emotional state is being tracked. Keep journaling for a more accurate reading."}
                </p>
                <button onClick={() => setTab('journal')} style={{ marginTop: '1rem', background: 'transparent', border: `1px solid ${c.border}`, borderRadius: '2px', color: c.textSecondary, fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '0.5rem 1rem', transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = c.borderLight; e.currentTarget.style.color = c.bone; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textSecondary; }}>
                  Open journal →
                </button>
              </div>
            </div>

            {/* Venting vault */}
            <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: '2px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontFamily: theme.fonts.serif, fontSize: '1.05rem', fontWeight: 400, color: c.bone }}>Venting Vault</h3>
                  <p style={{ fontSize: '0.78rem', color: c.textMuted, marginTop: '3px' }}>Your words stay private. They fade as you pour them out.</p>
                </div>
                <button onClick={handleVentRelease} disabled={!ventText.trim() || isReleasing} style={{ padding: '0.55rem 1.2rem', background: ventText.trim() ? c.bgCardHover : 'transparent', border: `1px solid ${ventText.trim() ? c.borderLight : c.border}`, borderRadius: '2px', color: ventText.trim() ? c.bone : c.textMuted, fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase', transition: 'all 0.2s', cursor: ventText.trim() ? 'pointer' : 'default' }}>
                  {isReleasing ? 'Releasing…' : 'Release'}
                </button>
              </div>
              <textarea value={ventText} onChange={e => setVentText(e.target.value)} disabled={isReleasing}
                placeholder="What is feeling heavy today?"
                style={{ width: '100%', minHeight: '140px', background: c.bgMid, border: `1px solid ${c.border}`, borderRadius: '2px', padding: '1rem', fontFamily: theme.fonts.serif, fontSize: '1.05rem', color: `rgba(229,215,196,${Math.max(0.2, 1 - (ventText.length / 600))})`, resize: 'none', outline: 'none', opacity: isReleasing ? 0 : 1, transition: 'color 0.6s ease, opacity 1s ease', lineHeight: 1.7 }}
                onFocus={e => e.target.style.borderColor = c.borderLight}
                onBlur={e => e.target.style.borderColor = c.border} />
            </div>

            {/* Quick nav */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
              {[
                { id: 'chat', icon: '⬡', label: 'Talk to Resonance', sub: 'Your companion is here' },
                { id: 'groups', icon: '◉', label: 'Peer Groups', sub: 'People who get it' },
              ].map(card => (
                <button key={card.id} onClick={() => setTab(card.id)} style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: '2px', padding: '1.25rem', textAlign: 'left', transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = c.borderLight; e.currentTarget.style.background = c.bgCardHover; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.background = c.bgCard; }}>
                  <div style={{ fontSize: '1.1rem', color: c.gold, marginBottom: '0.5rem' }}>{card.icon}</div>
                  <div style={{ fontSize: '0.88rem', color: c.bone, marginBottom: '3px' }}>{card.label}</div>
                  <div style={{ fontSize: '0.74rem', color: c.textMuted }}>{card.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        {tab === 'journal' && <JournalPage user={user} entries={entries} setEntries={setEntries} />}
        {tab === 'chat' && <ChatPage user={user} entries={entries} burnoutZone={burnoutData.zone} />}
        {tab === 'patterns' && <PatternsPage entries={entries} user={user} />}
        {tab === 'groups' && <GroupsPage user={user} />}
      </main>
    </div>
  );
}
