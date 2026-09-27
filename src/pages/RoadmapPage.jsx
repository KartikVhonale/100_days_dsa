import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Calendar, Compass, ArrowRight } from 'lucide-react';

export default function RoadmapPage({ currentTrack, onOpenTrackModal }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTrackMatrix()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading 100-day roadmap...</div>;
  }

  const track = data?.tracks?.find(t => t.id === currentTrack) || data?.tracks?.[1] || {};

  return (
    <div style={{ marginTop: '20px' }}>
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Compass size={18} color="var(--accent-blue)" />
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              100-Day Mastery Path
            </span>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff' }}>
            Milestone Roadmap
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Phase-by-phase progression calibrated for {track.name} ({track.subtitle})
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenTrackModal}>
          Change Track
        </button>
      </div>

      {/* Track Target Info Banner */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-card)',
        padding: '22px 26px',
        marginBottom: '28px',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '18px' }}>
          <div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Target Baseline</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--accent-blue)', marginTop: '4px' }}>{track.targetAudience}</div>
          </div>
          <div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Problem Mix</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginTop: '4px' }}>{track.targetMix}</div>
          </div>
          <div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Volume Target</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-easy)', marginTop: '4px' }}>{track.volumeTarget}</div>
          </div>
          <div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Daily Commitment</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-medium)', marginTop: '4px' }}>{track.dailyCommitment}</div>
          </div>
        </div>
      </div>

      {/* Phases Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {track.phases?.map((p, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-card)',
              padding: '24px 28px',
              backdropFilter: 'blur(20px)',
              transition: 'all var(--duration-smooth) var(--ease-apple)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <span style={{
                background: 'rgba(10, 132, 255, 0.16)',
                color: 'var(--accent-blue)',
                border: '1px solid rgba(10, 132, 255, 0.35)',
                fontSize: '11.5px',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 'var(--radius-pill)',
                letterSpacing: '0.02em'
              }}>
                {p.phase}
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
                {p.title}
              </h3>
            </div>

            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {p.topics}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
