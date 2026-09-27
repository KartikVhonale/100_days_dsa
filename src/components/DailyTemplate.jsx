import React from 'react';

export default function DailyTemplate({ protocol }) {
  if (!protocol) return null;

  const stages = [
    { label: 'Active Solving', pct: 40, mins: protocol.activeSolving?.minutes || 25, color: '#2997ff' },
    { label: 'Code Quality', pct: 30, mins: protocol.codeQuality?.minutes || 20, color: '#30d158' },
    { label: 'Pattern Catalog', pct: 20, mins: protocol.patternCatalog?.minutes || 15, color: '#bf5af2' },
    { label: 'Spaced Review', pct: 10, mins: protocol.spacedRepetition?.minutes || 10, color: '#ff9f0a' }
  ];

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-card)',
      padding: '18px 24px',
      marginBottom: '28px',
      backdropFilter: 'var(--glass-blur)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Daily 4-Stage Protocol
        </span>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Strict time-boxed distribution
        </span>
      </div>

      {/* Segmented split line */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '40fr 30fr 20fr 10fr',
        gap: '4px',
        height: '5px',
        borderRadius: 'var(--radius-pill)',
        overflow: 'hidden',
        marginBottom: '14px'
      }}>
        {stages.map((s, idx) => (
          <div key={idx} style={{ background: s.color }} title={`${s.pct}% ${s.label}`} />
        ))}
      </div>

      {/* Stat Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
        {stages.map((s, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-muted)' }}>{s.label}:</span>
            <strong style={{ color: '#ffffff', fontVariantNumeric: 'tabular-nums' }}>{s.pct}%</strong>
            <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>({s.mins}m)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
