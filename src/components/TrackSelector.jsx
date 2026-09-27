import React, { useState } from 'react';
import { X, CheckCircle, Shield, Award, Flame, Zap } from 'lucide-react';

export default function TrackSelector({ isOpen, onClose, currentTrack, onSelectTrack, targetDate, totalDays }) {
  if (!isOpen) return null;

  const [selected, setSelected] = useState(currentTrack || 'intermediate');
  const [customDays, setCustomDays] = useState(totalDays || 100);

  const tracks = [
    {
      id: 'beginner',
      title: 'Track 1: Beginner',
      target: 'Non-CS grads, new coders (L3 Bar)',
      badge: '50% Easy • 45% Med • 5% Hard',
      volume: '150–180 problems',
      hours: '3–4 hrs/day',
      icon: <Shield size={18} color="#30d158" />
    },
    {
      id: 'intermediate',
      title: 'Track 2: Intermediate',
      target: '0–2 YOE, stuck on Mediums (L4 Bar)',
      badge: '20% Easy • 65% Med • 15% Hard',
      volume: '220–260 problems',
      hours: '2.5–3 hrs/day',
      icon: <Zap size={18} color="#0a84ff" />
    },
    {
      id: 'advanced',
      title: 'Track 3: Advanced',
      target: '3–6 YOE, targets L4/L5, DP/Graph polish',
      badge: '10% Easy • 60% Med • 30% Hard',
      volume: '250–300 problems',
      hours: '2 hrs/day',
      icon: <Award size={18} color="#bf5af2" />
    },
    {
      id: 'elite',
      title: 'Track 4: Elite / Competitive',
      target: 'L6+, CP background, Google L5+/Meta E5+',
      badge: '20% Med • 80% Hard / Adv. Hard',
      volume: '180–220 curated Hards',
      hours: '1.5–2 hrs/day',
      icon: <Flame size={18} color="#ff453a" />
    },
    {
      id: 'all',
      title: 'Complete Striver A2Z Sheet',
      target: 'All 455 problems in chronological sequence',
      badge: '132 Easy • 186 Med • 136 Hard',
      volume: '455 problems total',
      hours: '3–4 hrs/day',
      icon: <CheckCircle size={18} color="#ff9f0a" />
    }
  ];

  const handleSave = () => {
    onSelectTrack(selected, customDays);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Select Preparation Track</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Todait recalibrates daily targets based on your chosen track baseline.
            </p>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
          {tracks.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelected(t.id)}
              style={{
                background: selected === t.id ? 'rgba(10, 132, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: `1.5px solid ${selected === t.id ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                borderRadius: '14px',
                padding: '14px 18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all var(--duration-quick) var(--ease-apple)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {t.icon}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '14.5px', color: '#fff' }}>{t.title}</span>
                    <span style={{ fontSize: '10.5px', padding: '1px 8px', borderRadius: 'var(--radius-pill)', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                      {t.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {t.target} • <strong style={{ color: '#fff' }}>{t.volume}</strong> • {t.hours}
                  </div>
                </div>
              </div>

              {selected === t.id && (
                <div style={{ color: 'var(--accent-blue)', fontWeight: 700, fontSize: '12.5px' }}>
                  Active
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            className="btn-link"
            style={{ padding: '8px 18px' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary"
          >
            Apply Track & Rebalance
          </button>
        </div>
      </div>
    </div>
  );
}
