import React from 'react';
import { theme } from '../theme/colors';

const c = theme.colors;

export default function ScoreGauge({ score = 0, zone = 'Loading' }) {
  const pct = Math.min(100, Math.max(0, score));
  const zoneColor =
    zone === 'Critical Burnout' ? c.danger :
    zone === 'Warning' ? c.warning : c.success;

  const angle = -180 + (pct / 100) * 180;

  return (
    <div style={{ textAlign: 'center' }}>
      <svg viewBox="0 0 200 110" width="180" height="100">
        {/* Track */}
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={c.bgCard} strokeWidth="12" strokeLinecap="round" />
        {/* Fill */}
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={zoneColor}
          strokeWidth="12" strokeLinecap="round" strokeDasharray="251.2"
          strokeDashoffset={251.2 - (pct / 100) * 251.2} opacity="0.8"
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }} />
        {/* Needle */}
        <g transform={`rotate(${angle}, 100, 100)`}>
          <line x1="100" y1="100" x2="100" y2="30" stroke={c.bone} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <circle cx="100" cy="100" r="5" fill={c.bone} />
        </g>
        {/* Score text */}
        <text x="100" y="92" textAnchor="middle" fontSize="22" fontWeight="300"
          fill={c.bone} fontFamily="'Cormorant Garamond', serif">{pct}
        </text>
      </svg>
      <p style={{ fontSize: '0.7rem', letterSpacing: '2px', color: zoneColor, textTransform: 'uppercase', marginTop: '4px' }}>
        {zone}
      </p>
    </div>
  );
}
