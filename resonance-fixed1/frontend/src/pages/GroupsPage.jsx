import React, { useState, useEffect, useRef } from 'react';
import { theme } from '../theme/colors';
import { apiFetch } from '../api';

const c = theme.colors;

export default function GroupsPage({ user }) {
  const [groups, setGroups] = useState([]);
  const [joined, setJoined] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('resonance_joined') || '[]')); }
    catch { return new Set(); }
  });
  const [active, setActive] = useState(null);
  const [msgs, setMsgs] = useState({});
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const msgEndRef = useRef(null);

  useEffect(() => { fetchGroups(); }, []);
  useEffect(() => { if (active) fetchMessages(active); }, [active]);
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => fetchMessages(active), 5000);
    return () => clearInterval(interval);
  }, [active]);
  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, active]);

  const fetchGroups = async () => {
    try {
      const res = await apiFetch('/groups/list');
      const data = await res.json();
      setGroups(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchMessages = async (groupId) => {
    try {
      const res = await apiFetch(`/groups/messages/${groupId}`);
      const data = await res.json();
      setMsgs(prev => ({ ...prev, [groupId]: data }));
    } catch (e) { console.error(e); }
  };

  const toggleJoin = async (groupId) => {
    const isJoined = joined.has(groupId);
    const endpoint = isJoined ? '/groups/leave' : '/groups/join';
    try {
      await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ group_id: groupId, user_name: user?.name || 'Anonymous', user_email: user?.email || 'demo@demo.com' }),
      });
      setJoined(prev => {
        const next = new Set(prev);
        isJoined ? next.delete(groupId) : next.add(groupId);
        localStorage.setItem('resonance_joined', JSON.stringify([...next]));
        return next;
      });
      await fetchGroups();
    } catch (e) { console.error(e); }
  };

  const toggleChat = (groupId) => {
    setActive(prev => prev === groupId ? null : groupId);
  };

  const sendMsg = async (groupId) => {
    const text = (inputs[groupId] || '').trim();
    if (!text || sending) return;
    setSending(true);
    try {
      await apiFetch('/groups/message', {
        method: 'POST',
        body: JSON.stringify({ group_id: groupId, user_name: user?.name || 'Me', user_email: user?.email || 'demo@demo.com', text }),
      });
      setInputs(prev => ({ ...prev, [groupId]: '' }));
      await fetchMessages(groupId);
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  };

  const myUid = user?.email?.replace('@', '_').replace('.', '_');

  if (loading) return (
    <div style={{ color: c.textMuted, fontSize: '0.85rem', padding: '2rem' }}>Loading groups...</div>
  );

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontFamily: theme.fonts.serif, fontWeight: 300, color: c.bone, fontSize: '1.4rem' }}>Peer groups</h2>
        <p style={{ fontSize: '0.78rem', color: c.textMuted, marginTop: '4px' }}>People who get it without explanation.</p>
      </div>

      {groups.map(group => {
        const isJoined = joined.has(group.id);
        const isOpen = active === group.id;
        const members = group.members || [];

        return (
          <div key={group.id} style={{
            background: c.bgCard, border: `1px solid ${isJoined ? c.borderLight : c.border}`,
            borderRadius: '2px', padding: '1.25rem', marginBottom: '0.85rem', transition: 'border-color 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex' }}>
                {(members.length > 0 ? members : [{ initials: '?' }]).slice(0, 4).map((m, i) => (
                  <div key={i} style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: c.bgCardHover, border: `2px solid ${c.bgCard}`,
                    marginLeft: i === 0 ? 0 : '-8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6rem', color: c.textSecondary, zIndex: 10 - i,
                  }}>{m.initials || '?'}</div>
                ))}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', color: c.bone }}>{group.name}</div>
                <div style={{ fontSize: '0.7rem', color: c.textMuted }}>{group.count} {group.count === 1 ? 'member' : 'members'}</div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => toggleChat(group.id)} style={{
                  padding: '5px 14px', borderRadius: '2px', fontSize: '0.72rem',
                  letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer',
                  border: `1px solid ${isOpen ? c.gold : c.border}`,
                  background: isOpen ? 'rgba(201,168,76,0.15)' : 'transparent',
                  color: isOpen ? c.gold : c.textMuted, transition: 'all 0.2s',
                }}>
                  {isOpen ? 'x Close' : 'Chat'}
                </button>
                <button onClick={() => toggleJoin(group.id)} style={{
                  padding: '5px 14px', borderRadius: '2px', fontSize: '0.72rem',
                  letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer',
                  border: `1px solid ${isJoined ? c.borderLight : c.border}`,
                  background: isJoined ? c.bgCardHover : 'transparent',
                  color: isJoined ? c.bone : c.textMuted, transition: 'all 0.2s',
                }}>
                  {isJoined ? 'Joined' : 'Join'}
                </button>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: c.textSecondary, lineHeight: 1.6, marginBottom: '0.6rem' }}>{group.desc}</p>
            <span style={{ fontSize: '0.65rem', padding: '2px 10px', background: 'rgba(92,138,58,0.15)', color: c.textSecondary, borderRadius: '1px', letterSpacing: '1px' }}>
              {group.tag}
            </span>

            {isOpen && (
              <div style={{ marginTop: '1rem', borderTop: `1px solid ${c.border}`, paddingTop: '1rem' }}>
                <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '0.75rem' }}>
                  {(msgs[group.id] || []).length === 0 && (
                    <p style={{ fontSize: '0.78rem', color: c.textMuted, fontStyle: 'italic' }}>No messages yet. Be the first to share.</p>
                  )}
                  {(msgs[group.id] || []).map((m, i) => (
                    <div key={i} style={{ fontSize: '0.83rem', lineHeight: 1.6, color: c.textSecondary }}>
                      <span style={{ fontWeight: 500, fontSize: '0.7rem', marginRight: '6px', color: m.mine_uid === myUid ? c.gold : c.textMuted, letterSpacing: '1px' }}>
                        {m.name}
                      </span>
                      {m.text}
                    </div>
                  ))}
                  <div ref={msgEndRef} />
                </div>
                {isJoined ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      value={inputs[group.id] || ''}
                      onChange={e => setInputs(prev => ({ ...prev, [group.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && sendMsg(group.id)}
                      placeholder="Share something..."
                      style={{
                        flex: 1, padding: '0.55rem 0.9rem',
                        background: c.bgMid, border: `1px solid ${c.border}`,
                        borderRadius: '2px', color: c.textPrimary, fontSize: '0.82rem', outline: 'none',
                      }}
                    />
                    <button onClick={() => sendMsg(group.id)} disabled={sending} style={{
                      padding: '0.55rem 1.1rem', background: c.bgCardHover,
                      border: `1px solid ${c.borderLight}`, borderRadius: '2px',
                      color: c.bone, fontSize: '0.72rem', letterSpacing: '1.5px',
                      textTransform: 'uppercase', cursor: 'pointer',
                    }}>
                      {sending ? '...' : 'Send'}
                    </button>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.75rem', color: c.textMuted, fontStyle: 'italic', textAlign: 'center', padding: '0.5rem', border: `1px solid ${c.border}`, borderRadius: '2px' }}>
                    Join this group to participate in the conversation.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}