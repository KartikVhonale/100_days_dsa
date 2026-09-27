import React, { useState } from 'react';
import {
  RefreshCw,
  Sliders,
  Flame,
  Calendar,
  TrendingUp,
  Award,
  Brain,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function TodaitCockpit({ todaitEngine, user, onRefresh, onOpenRoutineModal }) {
  if (!todaitEngine || !user) return null;

  const {
    totalTrackProblems,
    completedCount = 0,
    unsolvedCount = 0,
    dailyQuota = 3,
    paceStatus,
    completionPercentage = 0,
    streaks = {},
    schedule = []
  } = todaitEngine;

  const dayAbbrs = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const activeDayStr = (user.activeDays || [0, 1, 2, 3, 4, 5, 6]).map(d => dayAbbrs[d]).join(' ');
  const blackoutCount = (user.excludedDates || []).length;

  // Implementation Intentions: Tomorrow's focus slot (Peter Gollwitzer)
  const [focusSlot, setFocusSlot] = useState(() => {
    try {
      return localStorage.getItem('faang_focus_slot') || '08:00 AM (Morning)';
    } catch {
      return '08:00 AM (Morning)';
    }
  });

  const handleSelectSlot = (slot) => {
    setFocusSlot(slot);
    try {
      localStorage.setItem('faang_focus_slot', slot);
    } catch (e) {
      console.error(e);
    }
  };

  // Goal Gradient Effect: Candidate Levels (Hull's Hypothesis)
  const getCandidateLevel = (solved) => {
    if (solved < 10) {
      return { level: 1, title: 'Novice Grinder', target: 10, prev: 0 };
    }
    if (solved < 25) {
      return { level: 2, title: 'Pattern Builder', target: 25, prev: 10 };
    }
    if (solved < 60) {
      return { level: 3, title: 'Medium Conqueror', target: 60, prev: 25 };
    }
    if (solved < 120) {
      return { level: 4, title: 'Graph & DP Specialist', target: 120, prev: 60 };
    }
    if (solved < 200) {
      return { level: 5, title: 'FAANG Interview Ready', target: 200, prev: 120 };
    }
    return { level: 6, title: 'Staff / Elite Competitor', target: totalTrackProblems || 455, prev: 200 };
  };

  const levelInfo = getCandidateLevel(completedCount);
  const levelProgressUnits = Math.max(0, completedCount - levelInfo.prev);
  const levelSpanUnits = Math.max(1, levelInfo.target - levelInfo.prev);
  const levelPct = Math.min(100, Math.round((levelProgressUnits / levelSpanUnits) * 100));
  const problemsToNextLevel = Math.max(0, levelInfo.target - completedCount);

  // Loss Aversion Calculations (Kahneman & Tversky)
  const todaySolved = streaks.todaySolvedCount || 0;
  const todayRemaining = Math.max(0, dailyQuota - todaySolved);
  const isRingClosed = todayRemaining === 0;

  // Apple Fitness SVG Ring Calculations
  const RADIUS = 40;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const todayProgress = Math.min(1, todaySolved / Math.max(1, dailyQuota));
  const strokeDashoffset = CIRCUMFERENCE - (todayProgress * CIRCUMFERENCE);

  const overallProgress = Math.min(1, completionPercentage / 100);
  const overallOffset = CIRCUMFERENCE - (overallProgress * CIRCUMFERENCE);

  return (
    <div style={{
      background: 'rgba(18, 18, 22, 0.75)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-card)',
      padding: '26px 30px',
      marginBottom: '30px',
      backdropFilter: 'var(--glass-blur)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    }}>
      {/* =================================================================
          1. Loss Aversion: Streak Preservation Alert (Kahneman & Tversky)
         ================================================================= */}
      {!isRingClosed ? (
        <div style={{
          background: 'linear-gradient(90deg, rgba(255, 159, 10, 0.12) 0%, rgba(255, 69, 58, 0.08) 100%)',
          border: '1px solid rgba(255, 159, 10, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="flame-animated" style={{ fontSize: '20px' }}>🔥</span>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                Streak Protection: Solve {todayRemaining} problem{todayRemaining > 1 ? 's' : ''} to lock in Day {streaks.currentStreak ? streaks.currentStreak + 1 : 1}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Behavioral rule: Breaking a streak reduces 30-day interview retention by over 65%. Protect your momentum today.
              </div>
            </div>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(255, 159, 10, 0.18)',
            border: '1px solid rgba(255, 159, 10, 0.4)',
            color: 'var(--color-medium)',
            fontSize: '12px',
            fontWeight: 700
          }}>
            <ShieldAlert size={13} />
            <span>Streak At Risk</span>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(90deg, rgba(48, 209, 88, 0.14) 0%, rgba(41, 151, 255, 0.08) 100%)',
          border: '1px solid rgba(48, 209, 88, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} color="var(--color-easy)" />
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                Daily Activity Ring Closed! Streak Banked ({streaks.currentStreak || 1} Days)
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                You have outworked 92% of candidates preparing today. Neuro-plasticity loop successfully reinforced.
              </div>
            </div>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(48, 209, 88, 0.18)',
            border: '1px solid rgba(48, 209, 88, 0.4)',
            color: 'var(--color-easy)',
            fontSize: '12px',
            fontWeight: 700
          }}>
            <Sparkles size={13} />
            <span>Top 8% Cadence</span>
          </div>
        </div>
      )}

      {/* =================================================================
          2. Top Row: Apple Fitness Activity Rings + Quota Metrics
         ================================================================= */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Dual Activity Ring */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          <div style={{ position: 'relative', width: '104px', height: '104px', flexShrink: 0 }}>
            <svg width="104" height="104" viewBox="0 0 104 104" style={{ transform: 'rotate(-90deg)' }}>
              {/* Outer Ring Background (Track Completion) */}
              <circle
                cx="52"
                cy="52"
                r={RADIUS}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="8"
              />
              {/* Outer Ring Progress (Apple Blue) */}
              <circle
                cx="52"
                cy="52"
                r={RADIUS}
                fill="transparent"
                stroke="#2997ff"
                strokeWidth="8"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={overallOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.6s var(--ease)' }}
              />

              {/* Inner Ring Background (Today's Daily Target) */}
              <circle
                cx="52"
                cy="52"
                r="26"
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="7"
              />
              {/* Inner Ring Progress (Apple Activity Green) */}
              <circle
                cx="52"
                cy="52"
                r="26"
                fill="transparent"
                stroke="#30d158"
                strokeWidth="7"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 - (todayProgress * (2 * Math.PI * 26))}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.6s var(--ease)' }}
              />
            </svg>

            {/* Center Stat */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                {dailyQuota}
              </span>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', marginTop: '2px' }}>
                GOAL
              </span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                TODAY'S ACTIVITY
              </span>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                background: isRingClosed ? 'var(--color-easy-bg)' : 'var(--color-medium-bg)',
                color: isRingClosed ? 'var(--color-easy)' : 'var(--color-medium)',
                border: `1px solid ${isRingClosed ? 'var(--color-easy-border)' : 'var(--color-medium-border)'}`
              }}>
                {paceStatus}
              </span>
            </div>

            <div style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.03em', color: '#ffffff', fontVariantNumeric: 'tabular-nums', lineHeight: 1.15 }}>
              {todaySolved} <span style={{ fontSize: '20px', fontWeight: 500, color: 'var(--text-muted)' }}>/ {dailyQuota} problems</span>
            </div>

            <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Day {user.daysElapsed + 1} of 100 • <strong style={{ color: '#ffffff' }}>{user.remainingDays}</strong> active days remaining
            </div>
          </div>
        </div>

        {/* Metric Highlight Tiles */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Tile 1: Habit Streak with Animated Flame */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 18px',
            minWidth: '130px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '3px' }}>
              <span className="flame-animated">🔥</span>
              Streak
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', fontVariantNumeric: 'tabular-nums' }}>
              {streaks.currentStreak || 0} <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>days</span>
            </div>
          </div>

          {/* Tile 2: Overall Track Progress */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 18px',
            minWidth: '140px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '3px' }}>
              <TrendingUp size={14} color="var(--accent-blue)" />
              Mastery
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', fontVariantNumeric: 'tabular-nums' }}>
              {completionPercentage}% <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 500 }}>({completedCount} solved)</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              className="btn-secondary"
              onClick={onOpenRoutineModal}
              title="Configure active study days and blackouts"
            >
              <Sliders size={13} />
              Routine
            </button>
            <button
              className="btn-secondary"
              onClick={onRefresh}
              title="Recalculate dynamic quota"
            >
              <RefreshCw size={13} />
              Recalculate
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================
          3. Goal Gradient Effect: Candidate Mastery Level & Next Milestone
         ================================================================= */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={16} color="var(--accent-blue)" />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#ffffff' }}>
              Level {levelInfo.level}: {levelInfo.title}
            </span>
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--accent-blue)' }}>{problemsToNextLevel} more problems</strong> to reach Level {levelInfo.level + 1} ({levelPct}% to milestone)
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
          <div
            style={{
              width: `${levelPct}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #2997ff 0%, #5e5ce6 50%, #30d158 100%)',
              borderRadius: 'var(--radius-pill)',
              transition: 'width 0.4s var(--ease)'
            }}
          />
        </div>
      </div>

      {/* Track Battery Progress Bar */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          <span>Overall Track Coverage ({user.currentTrack.toUpperCase()})</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{unsolvedCount} remaining in catalog</span>
        </div>
        <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
          <div
            style={{
              width: `${Math.min(100, completionPercentage)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #2997ff 0%, #30d158 100%)',
              borderRadius: 'var(--radius-pill)',
              transition: 'width 0.4s var(--ease)'
            }}
          />
        </div>
      </div>

      {/* =================================================================
          4. Implementation Intentions: Lock in Tomorrow's Focus Slot (Gollwitzer)
         ================================================================= */}
      <div style={{
        paddingTop: '16px',
        borderTop: '1px solid var(--border-color)',
        marginBottom: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={15} color="var(--accent-blue)" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
            Pre-Commit Tomorrow's 25-Min Focus Window:
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['08:00 AM (Morning)', '01:30 PM (Midday)', '08:30 PM (Evening)'].map((slot) => {
            const isSelected = focusSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => handleSelectSlot(slot)}
                style={{
                  background: isSelected ? 'rgba(41, 151, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? '1.5px solid var(--accent-blue)' : '1px solid var(--border-color)',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit'
                }}
              >
                {isSelected && '✓ '}
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================================
          5. 14-Day Discrete Forecast Strip (Apple Weather Aesthetic)
         ================================================================= */}
      {schedule.length > 0 && (
        <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Calendar size={13} />
              14-Day Study Forecast (Discrete Remainder Allocation)
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              {activeDayStr} {blackoutCount > 0 && `• ${blackoutCount} blackouts`}
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            paddingBottom: '2px'
          }}>
            {schedule.slice(0, 14).map((item, idx) => (
              <div
                key={item.date}
                style={{
                  background: idx === 0 ? 'rgba(41, 151, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${idx === 0 ? 'rgba(41, 151, 255, 0.4)' : 'transparent'}`,
                  borderRadius: '12px',
                  padding: '10px 12px',
                  textAlign: 'center',
                  minWidth: '64px',
                  flexShrink: 0,
                  transition: 'all var(--duration) var(--ease)'
                }}
              >
                <div style={{
                  fontSize: '11px',
                  color: idx === 0 ? 'var(--accent-blue)' : 'var(--text-muted)',
                  fontWeight: 600,
                  letterSpacing: '0.03em'
                }}>
                  {idx === 0 ? 'TODAY' : item.dayOfWeek}
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: idx === 0 ? '#ffffff' : 'var(--text-main)',
                  fontVariantNumeric: 'tabular-nums',
                  margin: '2px 0'
                }}>
                  {item.quota}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-dim)' }}>
                  {item.date.slice(5)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
