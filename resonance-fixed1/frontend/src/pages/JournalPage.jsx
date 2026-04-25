import React, { useState } from 'react';
import { theme } from '../theme/colors';
import { apiFetch } from '../api';

const c = theme.colors;
const MOODS = [
  { score: 1, label: 'Overwhelmed', emoji: '😞' },
  { score: 2, label: 'Heavy', emoji: '😔' },
  { score: 3, label: 'Okay', emoji: '😐' },
  { score: 4, label: 'Lighter', emoji: '🙂' },
  { score: 5, label: 'Grateful', emoji: '😌' },
];

export default function JournalPage({ user, entries, setEntries }) {
  const [mood, setMood] = useState(null);
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const canSave = mood !== null && text.trim().length > 10;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    const entry = { text: text.trim(), mood, moodLabel: MOODS.find(m => m.score === mood)?.label, date: new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }), ts: Date.now() };
    try { await apiFetch('/journal/vent', { method: 'POST', body: JSON.stringify({ content: entry.text }) }); } catch { /* silent */ }
    setEntries(prev => [entry, ...prev]);
    setText(''); setMood(null); setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputBase = { width: '100%', background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: '2px', color: c.textPrimary, outline: 'none' };

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontFamily: theme.fonts.serif, fontWeight: 300, color: c.bone, fontSize: '1.4rem' }}>Today's entry</h2>
        <p style={{ fontSize: '0.78rem', color: c.textMuted, marginTop: '4px' }}>Write freely. Only you can see this.</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        {MOODS.map(m => (
          <button key={m.score} onClick={() => setMood(m.score)} style={{ flex: 1, padding: '10px 4px', border: `1px solid ${mood === m.score ? c.gold : c.border}`, borderRadius: '2px', background: mood === m.score ? 'rgba(201,168,76,0.12)' : c.bgCard, transition: 'all 0.15s', cursor: 'pointer' }}>
            <div style={{ fontSize: '1.1rem' }}>{m.emoji}</div>
            <div style={{ fontSize: '0.62rem', marginTop: '3px', color: mood === m.score ? c.gold : c.textMuted }}>{m.label}</div>
          </button>
        ))}
      </div>

      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="What's on your mind today? There's no right way to start."
        style={{ ...inputBase, minHeight: '180px', padding: '1rem', fontFamily: theme.fonts.serif, fontSize: '1.05rem', lineHeight: 1.8, resize: 'none' }}
        onFocus={e => e.target.style.borderColor = c.borderLight}
        onBlur={e => e.target.style.borderColor = c.border} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
        {saved && <span style={{ fontSize: '0.78rem', color: c.textSecondary, fontStyle: 'italic', fontFamily: theme.fonts.serif }}>Entry saved.</span>}
        <button onClick={handleSave} disabled={!canSave || saving} style={{ padding: '0.6rem 1.6rem', background: canSave ? c.bgCard : 'transparent', border: `1px solid ${canSave ? c.borderLight : c.border}`, borderRadius: '2px', color: canSave ? c.bone : c.textMuted, fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', transition: 'all 0.2s', cursor: canSave ? 'pointer' : 'default' }}>
          {saving ? 'Saving…' : 'Save entry'}
        </button>
      </div>

      {entries.length > 0 && (
        <div style={{ marginTop: '2.5rem' }}>
          <h3 style={{ fontFamily: theme.fonts.serif, fontWeight: 300, color: c.bone, fontSize: '1rem', marginBottom: '1rem' }}>Recent entries</h3>
          {entries.slice(0, 5).map(e => (
            <div key={e.ts} style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: '2px', padding: '1rem 1.25rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span>{MOODS.find(m => m.score === e.mood)?.emoji}</span>
                <span style={{ fontSize: '0.68rem', color: c.textSecondary, letterSpacing: '1px', textTransform: 'uppercase' }}>{e.moodLabel}</span>
                <span style={{ fontSize: '0.68rem', color: c.textMuted, marginLeft: 'auto' }}>{e.date}</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: c.textSecondary, fontFamily: theme.fonts.serif, fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>
                {e.text.length > 200 ? e.text.slice(0, 200) + '…' : e.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
