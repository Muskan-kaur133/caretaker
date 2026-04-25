import React, { useState, useRef, useEffect } from 'react';
import { theme } from '../theme/colors';
import { apiFetch } from '../api';

const c = theme.colors;
const FALLBACKS = [
  "That makes so much sense. What you're carrying is invisible to most people, but it's very real.",
  "You don't have to explain yourself here. What you're feeling is a completely normal part of this journey.",
  "It's okay to feel angry, or resentful, or just completely done. Those feelings don't make you a bad caretaker.",
  "Take a slow breath. You are doing something incredibly hard, and you deserve care too.",
  "I hear you. Is there one small thing — even tiny — you could do for yourself today?",
];

export default function ChatPage({ user, entries, burnoutZone }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello. I'm glad you're here. You don't have to be strong right now. How are you doing?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const logRef = useRef(null);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [messages]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const res = await apiFetch('/chat/send', {
        method: 'POST',
        body: JSON.stringify({ message: msg, burnout_zone: burnoutZone, journal_context: entries.slice(0, 3).map(e => `Mood: ${e.moodLabel}. "${e.text.slice(0, 120)}"`).join('\n') }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)] }]);
    } finally { setLoading(false); }
  };

  const zoneColor = burnoutZone === 'Critical Burnout' ? c.danger : burnoutZone === 'Warning' ? c.warning : c.success;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontFamily: theme.fonts.serif, fontWeight: 300, color: c.bone, fontSize: '1.4rem' }}>Talk to Resonance</h2>
        <p style={{ fontSize: '0.78rem', color: c.textMuted, marginTop: '4px' }}>A warm, non-clinical presence. Always here.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: '2px', padding: '0.6rem 1rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.68rem', color: c.textMuted, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Your burnout zone</span>
        <span style={{ fontSize: '0.82rem', color: zoneColor }}>{burnoutZone || 'Unknown'}</span>
      </div>

      <div ref={logRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '0.75rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ maxWidth: '80%', padding: '0.7rem 1rem', borderRadius: '2px', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? c.bgCardHover : c.bgCard, color: m.role === 'user' ? c.bone : c.textSecondary, fontFamily: m.role === 'ai' ? theme.fonts.serif : theme.fonts.sans, fontSize: '0.9rem', lineHeight: 1.7, border: `1px solid ${m.role === 'user' ? c.borderLight : c.border}` }}>
            {m.role === 'ai' && <span style={{ fontSize: '0.62rem', color: c.textMuted, letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Resonance</span>}
            {m.text}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', padding: '0.7rem 1rem', background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: '2px', fontSize: '0.82rem', color: c.textMuted, fontStyle: 'italic', fontFamily: theme.fonts.serif }}>
            Resonance is with you…
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Say anything…"
          style={{ flex: 1, padding: '0.75rem 1rem', background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: '2px', color: c.textPrimary, fontSize: '0.88rem', outline: 'none' }}
          onFocus={e => e.target.style.borderColor = c.borderLight}
          onBlur={e => e.target.style.borderColor = c.border} />
        <button onClick={send} disabled={!input.trim() || loading} style={{ padding: '0.75rem 1.4rem', background: c.bgCard, border: `1px solid ${input.trim() ? c.borderLight : c.border}`, borderRadius: '2px', color: input.trim() ? c.bone : c.textMuted, fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', cursor: input.trim() ? 'pointer' : 'default', opacity: !input.trim() || loading ? 0.5 : 1 }}>
          Send
        </button>
      </div>
    </div>
  );
}
