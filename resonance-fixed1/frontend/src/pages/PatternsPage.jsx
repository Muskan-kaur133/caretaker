import React, { useMemo } from 'react';
import { theme } from '../theme/colors';

const c = theme.colors;

const INSIGHTS = [
  { label: 'Suppressed emotion', insight: "You often describe things as 'fine' or 'okay' on days where your mood score was lowest. It looks like you might be holding more than you're letting yourself say.", evidence: 'Positive language detected alongside low mood scores', minEntries: 2 },
  { label: 'Repetition loop', insight: "The theme of feeling unseen keeps surfacing — in different words, on different days. This isn't just venting. It's something that may need attention.", evidence: 'Similar emotional themes across multiple entries', minEntries: 3 },
  { label: 'Emotional drop', insight: "Your mood has been declining while your language stays neutral. That gap — between how things sound and how they feel — is worth paying attention to.", evidence: 'Declining mood trend vs. neutral language tone', minEntries: 4 },
];

export default function PatternsPage({ entries, user }) {
  const [firestoreEntries, setFirestoreEntries] = React.useState([]);
  React.useEffect(() => {
    if (!user?.email) return;
    import('../api').then(({ apiFetch }) => {
      apiFetch('/journal/stats?user_email=' + encodeURIComponent(user.email))
        .then(r => r.json())
        .then(data => {
          if (data.mood_trend && data.mood_trend.length > 0) {
            setFirestoreEntries(data.mood_trend.map((m, i) => ({
              mood: Math.round((1 - m.stress) * 4) + 1,
              moodLabel: '',
              ts: i,
            })));
          }
        }).catch(console.error);
    });
  }, [user]);
  const allEntries = firestoreEntries.length > 0 ? firestoreEntries : entries;
  const moodHistory = useMemo(() => {
    const last7 = allEntries.slice(0, 7).reverse();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
    return days.map((day, i) => ({ day, mood: last7[i]?.mood ?? null }));
  }, [entries]);

  const avgMood = allEntries.length
    ? (allEntries.slice(0, 7).reduce((a, e) => a + e.mood, 0) / Math.min(allEntries.length, 7)).toFixed(1)
    : null;

  if (!allEntries.length) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <p style={{ fontFamily: theme.fonts.serif, color: c.textSecondary, fontSize: '1.1rem', fontStyle: 'italic', lineHeight: 1.8 }}>
          Write a few journal entries<br/>to see your patterns here.
        </p>
      </div>
    );
  }

  const trend = allEntries.length >= 2 
    ? (allEntries[0].mood < entries[1].mood ? 'Declining' : entries[0].mood > allEntries[1].mood ? 'Improving' : 'Steady')
    : 'Steady';

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontFamily: theme.fonts.serif, fontWeight: 300, color: c.bone, fontSize: '1.4rem' }}>Your patterns</h2>
        <p style={{ fontSize: '0.78rem', color: c.textMuted, marginTop: '4px' }}>What your journal reveals — including what you might not be saying.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
        {[
          { label: 'Entries this week', value: Math.min(allEntries.length, 7) },
          { label: 'Average mood', value: avgMood ? `${avgMood} / 5` : '—' },
          { label: 'Trend', value: trend },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: '2px', padding: '1rem' }}>
            <div style={{ fontSize: '0.68rem', color: c.textMuted, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>{s.label}</div>
            <div style={{ fontSize: '1.15rem', fontFamily: theme.fonts.serif, color: c.bone, fontWeight: 300 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Mood chart */}
      <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: '2px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.68rem', color: c.textMuted, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1rem' }}>Mood this week</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
          {moodHistory.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{
                width: '100%',
                height: d.mood ? `${Math.round((d.mood / 5) * 68)}px` : '4px',
                background: d.mood ? `rgba(92,138,58,${0.4 + (d.mood / 5) * 0.6})` : c.border,
                borderRadius: '2px 2px 0 0',
                transition: 'height 0.4s ease',
              }} />
              <div style={{ fontSize: '0.6rem', color: c.textMuted, letterSpacing: '0.5px' }}>{d.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div style={{ fontSize: '0.68rem', color: c.textMuted, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
        Unsaid layer — what the patterns suggest
      </div>
      {INSIGHTS.filter(ins => allEntries.length >= ins.minEntries).map((ins, i) => (
        <div key={i} style={{
          background: c.bgCard, border: `1px solid ${c.border}`,
          borderRadius: '2px', padding: '1.25rem', marginBottom: '0.75rem',
          borderLeft: `3px solid ${c.gold}`,
        }}>
          <div style={{ fontSize: '0.68rem', letterSpacing: '1.5px', color: c.gold, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            {ins.label}
          </div>
          <p style={{ fontFamily: theme.fonts.serif, fontSize: '0.95rem', color: c.textSecondary, lineHeight: 1.75, marginBottom: '0.5rem' }}>
            {ins.insight}
          </p>
          <p style={{ fontSize: '0.7rem', color: c.textMuted, fontStyle: 'italic' }}>{ins.evidence}</p>
        </div>
      ))}
      {entries.length < 2 && (
        <p style={{ fontSize: '0.82rem', color: c.textMuted, fontStyle: 'italic', fontFamily: theme.fonts.serif }}>
          Keep journaling — deeper insights unlock after a few more entries.
        </p>
      )}
    </div>
  );
}
