import React, { useEffect } from 'react';
import { Sparkles, Trophy, Flame, CheckCircle2, X } from 'lucide-react';

export default function RewardToast({ toast, onDismiss }) {
  if (!toast || !toast.visible) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4200);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const icons = {
    easy: <Sparkles size={18} color="var(--color-easy)" />,
    medium: <Flame size={18} color="var(--color-medium)" />,
    hard: <Trophy size={18} color="var(--accent-blue)" />,
    default: <CheckCircle2 size={18} color="var(--color-easy)" />
  };

  const currentIcon = icons[toast.difficulty?.toLowerCase()] || icons.default;

  return (
    <div
      className="reward-toast"
      onClick={onDismiss}
      style={{
        position: 'fixed',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2000,
        background: 'rgba(20, 20, 24, 0.94)',
        backdropFilter: 'blur(32px)',
        border: '1.5px solid rgba(48, 209, 88, 0.4)',
        borderRadius: 'var(--radius-pill)',
        padding: '10px 22px 10px 16px',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(48, 209, 88, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        maxWidth: '90vw'
      }}
    >
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'rgba(48, 209, 88, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {currentIcon}
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
            {toast.title || 'Algorithmic Pattern Ingrained!'}
          </span>
          {toast.badge && (
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '1px 7px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'var(--text-body)'
            }}>
              {toast.badge}
            </span>
          )}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '1px' }}>
          {toast.message}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onDismiss(); }}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-dim)',
          cursor: 'pointer',
          padding: '2px',
          marginLeft: '4px'
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
