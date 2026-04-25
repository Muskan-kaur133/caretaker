import React, { useState } from 'react';
import { theme } from '../theme/colors';

const c = theme.colors;

const GROUPS = [
  { id: 0, name: 'Caring for a parent', desc: 'For adult children navigating the role reversal — when you become the caretaker of the person who once cared for you.', members: ['AR', 'MK', 'PJ', 'SL'], count: 47, tag: 'parent caretaker', seed: [{ name: 'AR', text: 'Some days I just sit in my car for five minutes before going inside. That\'s my only break.' }, { name: 'MK', text: 'I do exactly this. You\'re not alone in that.' }, { name: 'PJ', text: 'That five minutes is survival. Don\'t ever give it up.' }] },
  { id: 1, name: 'Spousal caretakers', desc: 'When your partner is the one who needs constant care. The loneliness of that is unlike anything else.', members: ['DN', 'RV', 'TM'], count: 29, tag: 'spousal care', seed: [{ name: 'DN', text: 'Does anyone else feel guilty for wanting one day off?' }, { name: 'RV', text: 'Every single day. And then feel guilty for feeling guilty.' }, { name: 'TM', text: 'The guilt is part of it. It doesn\'t mean you love them less.' }] },
  { id: 2, name: 'Chronic illness journeys', desc: 'For those in the long haul — years, not months. Where resilience and exhaustion coexist daily.', members: ['AC', 'BF', 'HQ', 'LN', 'YP'], count: 83, tag: 'chronic care', seed: [{ name: 'HQ', text: 'She had a good day today and I cried in the bathroom because I didn\'t know what to do with that feeling.' }, { name: 'AC', text: 'That\'s the paradox of this whole life. Good days can be disorienting.' }, { name: 'LN', text: 'Like you forgot how to breathe normally when things aren\'t in crisis mode.' }] },
  { id: 3, name: 'First-year caretakers', desc: 'Just starting out and overwhelmed. A gentler group for those still finding their footing.', members: ['JW', 'EM'], count: 18, tag: 'new caretaker', seed: [{ name: 'JW', text: 'I haven\'t had a full night\'s sleep in 11 months.' }, { name: 'EM', text: 'Neither have I. And people keep saying "you look tired" like I don\'t know.' }] },
];

const PEER_REPLIES = ['Thank you for sharing that. We hear you.', 'That resonates so much. You\'re not alone in this.', 'Yes. Exactly this. I\'ve been feeling the same way.', 'Sending you so much support right now.', 'This group needed someone to say that out loud. Thank you.'];

export default function GroupsPage({ user }) {
  const [joined, setJoined] = useState([]);
  const [active, setActive] = useState(null);
  const [msgs, setMsgs] = useState(() => Object.fromEntries(GROUPS.map(g => [g.id, [...g.seed]])));
  const [inputs, setInputs] = useState({});

  const toggleJoin = (id) => {
    setJoined(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setActive(prev => prev === id && joined.includes(id) ? null : id);
  };

  const sendMsg = (gid) => {
    const text = (inputs[gid] || '').trim();
    if (!text) return;
    const myName = user?.name?.slice(0, 2).toUpperCase() || 'ME';
    setMsgs(prev => ({ ...prev, [gid]: [...prev[gid], { name: myName, text, mine: true }] }));
    setInputs(prev => ({ ...prev, [gid]: '' }));
    setTimeout(() => {
      const g = GROUPS.find(g => g.id === gid);
      setMsgs(prev => ({ ...prev, [gid]: [...prev[gid], { name: g.members[Math.floor(Math.random() * g.members.length)], text: PEER_REPLIES[Math.floor(Math.random() * PEER_REPLIES.length)], mine: false }] }));
    }, 1500);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontFamily: theme.fonts.serif, fontWeight: 300, color: c.bone, fontSize: '1.4rem' }}>Peer groups</h2>
        <p style={{ fontSize: '0.78rem', color: c.textMuted, marginTop: '4px' }}>People who get it without explanation.</p>
      </div>

      {GROUPS.map(group => {
        const isJoined = joined.includes(group.id);
        const isOpen = active === group.id && isJoined;

        return (
          <div key={group.id} style={{
            background: c.bgCard,
            border: `1px solid ${isJoined ? c.borderLight : c.border}`,
            borderRadius: '2px', padding: '1.25rem', marginBottom: '0.85rem',
            transition: 'border-color 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex' }}>
                {group.members.slice(0, 4).map((av, i) => (
                  <div key={i} style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: c.bgCardHover, border: `2px solid ${c.bgCard}`,
                    marginLeft: i === 0 ? 0 : '-8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6rem', color: c.textSecondary,
                    zIndex: group.members.length - i,
                  }}>{av}</div>
                ))}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', color: c.bone }}>{group.name}</div>
                <div style={{ fontSize: '0.7rem', color: c.textMuted }}>{group.count} members</div>
              </div>
              <button onClick={() => toggleJoin(group.id)} style={{
                padding: '5px 16px', borderRadius: '2px', fontSize: '0.72rem',
                letterSpacing: '1.5px', textTransform: 'uppercase',
                border: `1px solid ${isJoined ? c.borderLight : c.border}`,
                background: isJoined ? c.bgCardHover : 'transparent',
                color: isJoined ? c.bone : c.textMuted,
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { if (!isJoined) { e.currentTarget.style.borderColor = c.borderLight; e.currentTarget.style.color = c.textSecondary; } }}
                onMouseLeave={e => { if (!isJoined) { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textMuted; } }}>
                {isJoined ? '✓ Joined' : 'Join'}
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: c.textSecondary, lineHeight: 1.6, marginBottom: '0.6rem' }}>{group.desc}</p>
            <span style={{ fontSize: '0.65rem', padding: '2px 10px', background: 'rgba(92,138,58,0.15)', color: c.textSecondary, borderRadius: '1px', letterSpacing: '1px' }}>
              {group.tag}
            </span>

            {isOpen && (
              <div style={{ marginTop: '1rem', borderTop: `1px solid ${c.border}`, paddingTop: '1rem' }}>
                <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '0.75rem' }}>
                  {(msgs[group.id] || []).map((m, i) => (
                    <div key={i} style={{ fontSize: '0.83rem', lineHeight: 1.6, color: c.textSecondary }}>
                      <span style={{ fontWeight: 500, fontSize: '0.7rem', marginRight: '6px', color: m.mine ? c.gold : c.textMuted, letterSpacing: '1px' }}>{m.name}</span>
                      {m.text}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    value={inputs[group.id] || ''}
                    onChange={e => setInputs(prev => ({ ...prev, [group.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && sendMsg(group.id)}
                    placeholder="Share something…"
                    style={{
                      flex: 1, padding: '0.55rem 0.9rem',
                      background: c.bgMid, border: `1px solid ${c.border}`,
                      borderRadius: '2px', color: c.textPrimary,
                      fontSize: '0.82rem', outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = c.borderLight}
                    onBlur={e => e.target.style.borderColor = c.border}
                  />
                  <button onClick={() => sendMsg(group.id)} style={{
                    padding: '0.55rem 1.1rem', background: c.bgCardHover,
                    border: `1px solid ${c.borderLight}`, borderRadius: '2px',
                    color: c.bone, fontSize: '0.72rem', letterSpacing: '1.5px', textTransform: 'uppercase',
                  }}>Send</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
