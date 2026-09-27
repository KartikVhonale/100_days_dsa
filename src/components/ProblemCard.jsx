import React, { useState, useEffect, useRef } from 'react';
import {
  Check,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Clock,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

export default function ProblemCard({ problem, onToggle, isToggling }) {
  const prob = (problem && problem._doc) ? { ...problem._doc, ...problem } : (problem || {});

  const title = prob.title || 'Untitled Problem';
  const sequenceOrder = prob.sequenceOrder || 0;
  const difficulty = prob.difficulty || 'Easy';
  const difficultyClass = difficulty.toLowerCase();
  const stepTitle = prob.stepTitle || '';
  const subStepTitle = prob.subStepTitle || '';
  const topic = prob.topic || '';
  const links = prob.links || {};
  const isCompleted = Boolean(prob.isCompleted);

  // Notes & Progress State
  const [showNotes, setShowNotes] = useState(false);
  const [timeSpent, setTimeSpent] = useState(prob.progressDetails?.timeSpentMinutes || 25);
  const [timeComplexity, setTimeComplexity] = useState(prob.progressDetails?.timeComplexity || 'O(N)');
  const [spaceComplexity, setSpaceComplexity] = useState(prob.progressDetails?.spaceComplexity || 'O(1)');
  const [notes, setNotes] = useState(prob.progressDetails?.notes || '');

  // Solving Stopwatch & Focus Timer State
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('stopwatch'); // 'stopwatch' | 'target25' | 'target40'
  const initialSeconds = (prob.progressDetails?.timeSpentMinutes && prob.progressDetails.timeSpentMinutes > 0)
    ? prob.progressDetails.timeSpentMinutes * 60
    : 0;
  const [timerSeconds, setTimerSeconds] = useState(initialSeconds);
  const accumulatedSecRef = useRef(initialSeconds);
  const startTimeRef = useRef(null);

  // Background-drift-immune timer interval using Date.now()
  useEffect(() => {
    let intervalId = null;
    if (isRunning) {
      startTimeRef.current = Date.now();
      const baseSec = accumulatedSecRef.current;
      intervalId = setInterval(() => {
        const delta = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const currentTotal = baseSec + delta;
        setTimerSeconds(currentTotal);
        // Automatically sync minutes with progress input
        const mins = Math.max(1, Math.round(currentTotal / 60));
        setTimeSpent(mins);
      }, 250);
    } else {
      accumulatedSecRef.current = timerSeconds;
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning]);

  const toggleRunning = () => {
    if (!isRunning) {
      setIsTimerOpen(true);
      setIsRunning(true);
    } else {
      accumulatedSecRef.current = timerSeconds;
      setIsRunning(false);
    }
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    accumulatedSecRef.current = 0;
    setTimerSeconds(0);
    setTimeSpent(0);
  };

  const handleAddMinutes = (minsToAdd) => {
    const extraSeconds = minsToAdd * 60;
    const nextTotal = timerSeconds + extraSeconds;
    accumulatedSecRef.current = nextTotal;
    setTimerSeconds(nextTotal);
    if (isRunning) {
      startTimeRef.current = Date.now();
    }
    setTimeSpent(Math.max(1, Math.round(nextTotal / 60)));
  };

  const formatDisplayTime = (totalSeconds) => {
    const s = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Target countdown calculation
  const getCountdownData = () => {
    const targetSec = timerMode === 'target40' ? 2400 : 1500; // 40m or 25m
    const remaining = targetSec - timerSeconds;
    const isOvertime = remaining < 0;
    const pct = Math.min(100, Math.max(0, (timerSeconds / targetSec) * 100));
    return {
      targetSec,
      remainingText: isOvertime
        ? `+${formatDisplayTime(Math.abs(remaining))}`
        : formatDisplayTime(remaining),
      isOvertime,
      pct
    };
  };

  const handleSaveAndMarkSolved = () => {
    const finalMinutes = Math.max(1, Math.round(timerSeconds / 60));
    setIsRunning(false);
    onToggle(sequenceOrder, {
      timeSpentMinutes: finalMinutes,
      timeComplexity,
      spaceComplexity,
      notes
    });
  };

  const handleToggle = () => {
    const effectiveMins = timerSeconds > 0
      ? Math.max(1, Math.round(timerSeconds / 60))
      : Number(timeSpent);
    onToggle(sequenceOrder, {
      timeSpentMinutes: effectiveMins,
      timeComplexity,
      spaceComplexity,
      notes
    });
  };

  const countdownData = getCountdownData();

  return (
    <div className={`problem-card ${isCompleted ? 'completed' : ''}`}>
      <div className="problem-left">
        {/* Apple Reminders Style Circle Check */}
        <button
          className={`check-btn ${isCompleted ? 'checked' : ''}`}
          onClick={handleToggle}
          disabled={isToggling}
          title={isCompleted ? 'Mark as Unsolved' : 'Mark as Solved'}
        >
          {isCompleted && <Check size={12} strokeWidth={3} />}
        </button>

        <div className="problem-info" style={{ flex: 1 }}>
          <div className="problem-title-row">
            <span className="problem-seq">#{String(sequenceOrder).padStart(3, '0')}</span>
            <span className={`diff-dot ${difficultyClass}`} title={`Difficulty: ${difficulty}`} />
            
            {/* Clickable Question Title that reveals the Solving Timer */}
            <button
              className="problem-title-btn"
              onClick={() => setIsTimerOpen(!isTimerOpen)}
              title="Click question to track solving time"
            >
              <span style={{
                color: isCompleted ? 'var(--text-muted)' : '#ffffff',
                textDecoration: isCompleted ? 'line-through' : 'none'
              }}>
                {title}
              </span>

              {/* Hover indicator hint */}
              {!isRunning && timerSeconds === 0 && (
                <span className="title-timer-hint">
                  <Timer size={12} />
                  <span>Track Time</span>
                </span>
              )}
            </button>

            {/* Live Timer Pill when timer is ticking or has recorded time */}
            {(isRunning || timerSeconds > 0) && (
              <button
                type="button"
                className={`live-timer-chip ${!isRunning ? 'paused' : ''}`}
                onClick={() => setIsTimerOpen(!isTimerOpen)}
                title={isRunning ? 'Stopwatch ticking - Click to view controls' : 'Timer paused - Click to resume'}
              >
                <span className="pulse-dot" />
                <span>
                  {timerMode === 'stopwatch'
                    ? formatDisplayTime(timerSeconds)
                    : countdownData.remainingText}
                </span>
                {!isRunning && <span style={{ fontSize: '10px', opacity: 0.8 }}>(Paused)</span>}
              </button>
            )}
          </div>

          <div className="problem-meta">
            {stepTitle && <span>{stepTitle} {subStepTitle && `› ${subStepTitle}`}</span>}
            {stepTitle && topic && <span>•</span>}
            {topic && <span>{topic}</span>}
          </div>

          {/* =================================================================
              Apple Developer Solving Stopwatch & Focus Timer Drawer
             ================================================================= */}
          {isTimerOpen && (
            <div className="solving-timer-drawer">
              {/* Header: Mode Switcher & Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button
                    type="button"
                    className={`timer-mode-btn ${timerMode === 'stopwatch' ? 'active' : ''}`}
                    onClick={() => setTimerMode('stopwatch')}
                  >
                    Stopwatch
                  </button>
                  <button
                    type="button"
                    className={`timer-mode-btn ${timerMode === 'target25' ? 'active' : ''}`}
                    onClick={() => setTimerMode('target25')}
                  >
                    25m FAANG
                  </button>
                  <button
                    type="button"
                    className={`timer-mode-btn ${timerMode === 'target40' ? 'active' : ''}`}
                    onClick={() => setTimerMode('target40')}
                  >
                    40m Hard
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span className="pulse-dot" style={{ background: isRunning ? 'var(--color-easy)' : 'var(--color-medium)' }} />
                  <span style={{ fontWeight: 600, color: isRunning ? 'var(--color-easy)' : 'var(--color-medium)' }}>
                    {isRunning ? 'TRACKING TIME' : (timerSeconds > 0 ? 'PAUSED' : 'READY')}
                  </span>
                </div>
              </div>

              {/* Time Display & Countdown Progress Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '28px',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    fontVariantNumeric: 'tabular-nums',
                    color: (timerMode !== 'stopwatch' && countdownData.isOvertime) ? 'var(--color-hard)' : '#ffffff',
                    lineHeight: 1
                  }}>
                    {timerMode === 'stopwatch'
                      ? formatDisplayTime(timerSeconds)
                      : countdownData.remainingText}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {timerMode === 'stopwatch'
                      ? `Elapsed: ${Math.round(timerSeconds / 60)} mins`
                      : (countdownData.isOvertime
                        ? `Exceeded ${timerMode === 'target40' ? '40' : '25'}m target`
                        : `${timerMode === 'target40' ? '40' : '25'}m interview countdown`)}
                  </div>
                </div>

                {/* Quick Add Minutes */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleAddMinutes(1)}
                    title="Add 1 minute"
                    style={{ padding: '4px 10px', fontSize: '11.5px' }}
                  >
                    +1m
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleAddMinutes(5)}
                    title="Add 5 minutes"
                    style={{ padding: '4px 10px', fontSize: '11.5px' }}
                  >
                    +5m
                  </button>
                </div>
              </div>

              {/* Progress bar for target countdown mode */}
              {timerMode !== 'stopwatch' && (
                <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${countdownData.pct}%`,
                    height: '100%',
                    background: countdownData.isOvertime ? 'var(--color-hard)' : 'var(--accent-blue)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              )}

              {/* Controls Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Start / Pause */}
                  <button
                    type="button"
                    onClick={toggleRunning}
                    className="btn-primary"
                    style={{
                      background: isRunning
                        ? 'rgba(48, 209, 88, 0.2)'
                        : (timerSeconds > 0 ? '#2997ff' : '#ffffff'),
                      color: isRunning ? 'var(--color-easy)' : (timerSeconds > 0 ? '#ffffff' : '#000000'),
                      border: isRunning ? '1px solid var(--color-easy)' : 'none',
                      padding: '7px 18px'
                    }}
                  >
                    {isRunning ? (
                      <>
                        <Pause size={14} />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play size={14} fill={timerSeconds > 0 ? '#ffffff' : '#000000'} />
                        <span>{timerSeconds > 0 ? 'Resume' : 'Start Timer'}</span>
                      </>
                    )}
                  </button>

                  {/* Reset */}
                  <button
                    type="button"
                    onClick={handleResetTimer}
                    className="btn-secondary"
                    title="Reset stopwatch to 00:00"
                    style={{ padding: '7px 12px' }}
                  >
                    <RotateCcw size={13} />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Mark Solved & Log Time */}
                <button
                  type="button"
                  onClick={handleSaveAndMarkSolved}
                  disabled={isToggling}
                  className="btn-secondary"
                  style={{
                    background: isCompleted ? 'rgba(48, 209, 88, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                    borderColor: isCompleted ? 'var(--color-easy)' : 'var(--border-color)',
                    color: isCompleted ? 'var(--color-easy)' : '#ffffff',
                    fontWeight: 600
                  }}
                >
                  <Check size={14} />
                  <span>
                    {isCompleted
                      ? `Update Time (${Math.max(1, Math.round(timerSeconds / 60))}m)`
                      : `Mark Solved (${Math.max(1, Math.round(timerSeconds / 60))}m)`}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Notes & Invariants Drawer */}
          {showNotes && (
            <div style={{ marginTop: '12px', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Time (mins)</label>
                  <input
                    type="number"
                    value={timeSpent}
                    onChange={(e) => setTimeSpent(e.target.value)}
                    className="input-field"
                    style={{ padding: '6px 10px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Time Complexity</label>
                  <input
                    type="text"
                    value={timeComplexity}
                    onChange={(e) => setTimeComplexity(e.target.value)}
                    className="input-field"
                    style={{ padding: '6px 10px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Space Complexity</label>
                  <input
                    type="text"
                    value={spaceComplexity}
                    onChange={(e) => setSpaceComplexity(e.target.value)}
                    className="input-field"
                    style={{ padding: '6px 10px', fontSize: '13px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontWeight: 500 }}>Invariants & Edge Cases</label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes, loop invariants, edge cases handled..."
                  className="input-field"
                  style={{ padding: '8px 10px', fontSize: '13px', resize: 'vertical' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons: Timer, LC, GFG, Editorial, Video, Notes */}
      <div className="problem-actions">
        {/* Quick Timer Toggle Button */}
        <button
          className="btn-link"
          onClick={() => setIsTimerOpen(!isTimerOpen)}
          title={isRunning ? `Tracking: ${formatDisplayTime(timerSeconds)}` : 'Track solving time'}
          style={{
            padding: '5px 9px',
            color: isRunning ? 'var(--color-easy)' : 'var(--text-muted)',
            borderColor: isRunning ? 'rgba(48, 209, 88, 0.4)' : undefined,
            background: isRunning ? 'rgba(48, 209, 88, 0.12)' : undefined
          }}
        >
          <Timer size={13} />
          <span>{isRunning ? formatDisplayTime(timerSeconds) : 'Timer'}</span>
        </button>

        {links.leetcode && (
          <a
            href={links.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-link"
            title="Open on LeetCode"
          >
            LC
          </a>
        )}

        {links.gfg && (
          <a
            href={links.gfg}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-link"
            title="Open on GeeksForGeeks"
          >
            GFG
          </a>
        )}

        {links.takeuforward && (
          <a
            href={links.takeuforward}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-link"
            title="Read Striver Editorial"
          >
            <FileText size={12} />
            Editorial
          </a>
        )}

        {links.youtube && (
          <a
            href={links.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-link"
            title="Watch Video"
          >
            <Play size={12} />
            Video
          </a>
        )}

        <button
          className="btn-link"
          onClick={() => setShowNotes(!showNotes)}
          title="Log Notes"
          style={{ padding: '5px 8px' }}
        >
          {showNotes ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
    </div>
  );
}
