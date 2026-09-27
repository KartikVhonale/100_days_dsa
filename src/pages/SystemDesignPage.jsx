import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api/client';
import {
  Server,
  Database,
  Network,
  Cpu,
  Shield,
  Zap,
  Layers,
  ChevronDown,
  ChevronUp,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Calculator,
  Compass,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowRight,
  Activity,
  Globe,
  HardDrive,
  FileText,
  Search,
  Code,
  Check
} from 'lucide-react';

export default function SystemDesignPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('archetypes'); // 'archetypes' | 'progression' | 'timer' | 'calculator' | 'primitives'
  const [expandedArchetypeId, setExpandedArchetypeId] = useState('heavy-read');
  const [archetypeSearch, setArchetypeSearch] = useState('');

  // 4-Phase Progression Tracker State
  const [masteredTopics, setMasteredTopics] = useState(() => {
    try {
      const saved = localStorage.getItem('faang_sysdesign_mastery');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleTopicMastery = (topicName) => {
    setMasteredTopics(prev => {
      const updated = { ...prev, [topicName]: !prev[topicName] };
      try {
        localStorage.setItem('faang_sysdesign_mastery', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // 45-Minute Timer State
  const TOTAL_TIMER_SECONDS = 45 * 60; // 2700s
  const [secondsRemaining, setSecondsRemaining] = useState(TOTAL_TIMER_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isTimerRunning]);

  const resetTimer = () => {
    setIsTimerRunning(false);
    setSecondsRemaining(TOTAL_TIMER_SECONDS);
  };

  // Determine current interview phase from elapsed time
  const elapsedSeconds = TOTAL_TIMER_SECONDS - secondsRemaining;
  const elapsedMinutes = elapsedSeconds / 60;

  let currentPhaseIndex = 0;
  if (elapsedMinutes < 7) {
    currentPhaseIndex = 0; // Phase 1: Clarify (0-7m)
  } else if (elapsedMinutes < 10) {
    currentPhaseIndex = 1; // Phase 2: Math (7-10m)
  } else if (elapsedMinutes < 20) {
    currentPhaseIndex = 2; // Phase 3: HLD (10-20m)
  } else if (elapsedMinutes < 38) {
    currentPhaseIndex = 3; // Phase 4: Deep Dive (20-38m)
  } else {
    currentPhaseIndex = 4; // Phase 5: Wrap-up (38-45m)
  }

  const jumpToPhase = (phaseIdx) => {
    const phaseStartsInMinutes = [0, 7, 10, 20, 38];
    const targetElapsedMin = phaseStartsInMinutes[phaseIdx];
    const newRemaining = Math.max(0, TOTAL_TIMER_SECONDS - (targetElapsedMin * 60));
    setSecondsRemaining(newRemaining);
  };

  // Anchor Math Calculator State
  const [calcDau, setCalcDau] = useState(10000000); // 10M DAU
  const [calcReadsPerUser, setCalcReadsPerUser] = useState(50);
  const [calcWritesPerUser, setCalcWritesPerUser] = useState(5);
  const [calcReadSizeKb, setCalcReadSizeKb] = useState(2); // 2 KB
  const [calcWriteSizeKb, setCalcWriteSizeKb] = useState(1); // 1 KB
  const [calcPeakMult, setCalcPeakMult] = useState(3);
  const [calcRetentionYears, setCalcRetentionYears] = useState(5);

  const applyCalcPreset = (presetName) => {
    if (presetName === 'twitter') {
      setCalcDau(300000000); // 300M DAU
      setCalcReadsPerUser(60);
      setCalcWritesPerUser(2);
      setCalcReadSizeKb(2);
      setCalcWriteSizeKb(0.5);
      setCalcPeakMult(3);
      setCalcRetentionYears(5);
    } else if (presetName === 'uber') {
      setCalcDau(50000000); // 50M DAU
      setCalcReadsPerUser(20);
      setCalcWritesPerUser(100); // Drivers reporting location every few secs
      setCalcReadSizeKb(1);
      setCalcWriteSizeKb(0.2);
      setCalcPeakMult(4);
      setCalcRetentionYears(3);
    } else if (presetName === 'whatsapp') {
      setCalcDau(500000000); // 500M DAU
      setCalcReadsPerUser(200);
      setCalcWritesPerUser(200);
      setCalcReadSizeKb(1);
      setCalcWriteSizeKb(1);
      setCalcPeakMult(3);
      setCalcRetentionYears(5);
    } else if (presetName === 'metrics') {
      setCalcDau(1000000); // 1M servers / agents
      setCalcReadsPerUser(10);
      setCalcWritesPerUser(8640); // 1 metric every 10 seconds
      setCalcReadSizeKb(10);
      setCalcWriteSizeKb(0.2);
      setCalcPeakMult(2);
      setCalcRetentionYears(1);
    }
  };

  // Reactive Calculations
  const dailyReads = calcDau * calcReadsPerUser;
  const dailyWrites = calcDau * calcWritesPerUser;
  const totalDailyReq = dailyReads + dailyWrites;

  const readQps = Math.round(dailyReads / 86400);
  const writeQps = Math.round(dailyWrites / 86400);
  const totalQps = readQps + writeQps;
  const peakQps = totalQps * calcPeakMult;

  // Bandwidth in MB/s: (QPS * Size in KB) / 1024
  const ingressMbPerSec = ((writeQps * calcWriteSizeKb) / 1024).toFixed(1);
  const ingressGbps = ((ingressMbPerSec * 8) / 1024).toFixed(2);
  const egressMbPerSec = ((readQps * calcReadSizeKb) / 1024).toFixed(1);
  const egressGbps = ((egressMbPerSec * 8) / 1024).toFixed(2);

  // Storage
  // Daily write bytes = dailyWrites * calcWriteSizeKb * 1024
  const dailyWriteGb = (dailyWrites * calcWriteSizeKb) / (1024 * 1024);
  const yearlyWriteTb = (dailyWriteGb * 365) / 1024;
  const multiYearStorageTb = (yearlyWriteTb * calcRetentionYears).toFixed(1);

  // 80/20 Cache RAM size: 20% of daily reads * read size
  const cacheWorkingSetGb = ((dailyReads * 0.20 * calcReadSizeKb) / (1024 * 1024)).toFixed(1);

  useEffect(() => {
    api.getSystemDesign()
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
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
        <Activity size={32} className="spinning" style={{ margin: '0 auto 12px' }} />
        <div>Loading 2026 FAANG System Design Command Center...</div>
      </div>
    );
  }

  const {
    progressionPlan = [],
    archetypes = [],
    framework = [],
    cheatSheet = [],
    anchorNumbers = {}
  } = data || {};

  // Filter archetypes
  const filteredArchetypes = archetypes.filter(arch => {
    if (!archetypeSearch.trim()) return true;
    const q = archetypeSearch.toLowerCase();
    return (
      arch.title.toLowerCase().includes(q) ||
      arch.category.toLowerCase().includes(q) ||
      arch.interviewsMapped?.some(m => m.toLowerCase().includes(q))
    );
  });

  // Calculate overall progression mastery percentage
  const allTopicNames = progressionPlan.flatMap(p => p.topics?.map(t => t.name) || []);
  const masteredCount = allTopicNames.filter(name => masteredTopics[name]).length;
  const masteryPercent = allTopicNames.length > 0 ? Math.round((masteredCount / allTopicNames.length) * 100) : 0;

  // Format timer MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div className="section-header" style={{ marginBottom: '22px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              background: 'rgba(10, 132, 255, 0.16)',
              color: 'var(--accent-blue)',
              border: '1px solid rgba(10, 132, 255, 0.35)',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              letterSpacing: '0.04em'
            }}>
              2026 ARCHITECTURE
            </span>
            <span style={{ fontSize: '12.5px', color: 'var(--text-dim)', fontWeight: 500 }}>
              Meta E5/E6 • Google L5/L6 • Amazon Principal Standard
            </span>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff' }}>
            FAANG System Design Hub
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Master distributed trade-offs, operational failure modes, and the 5 canonical archetypes that cover 90% of Big Tech interviews.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-tabs" style={{ flexWrap: 'wrap' }}>
          <button
            className={`nav-tab ${activeTab === 'archetypes' ? 'active' : ''}`}
            onClick={() => setActiveTab('archetypes')}
          >
            <Server size={15} />
            5 High-Yield Archetypes ({archetypes.length})
          </button>
          <button
            className={`nav-tab ${activeTab === 'progression' ? 'active' : ''}`}
            onClick={() => setActiveTab('progression')}
          >
            <Compass size={15} />
            Roadmap (Weeks 1–8)
            {masteryPercent > 0 && (
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                padding: '1px 6px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 700
              }}>
                {masteryPercent}%
              </span>
            )}
          </button>
          <button
            className={`nav-tab ${activeTab === 'timer' ? 'active' : ''}`}
            onClick={() => setActiveTab('timer')}
          >
            <Clock size={15} />
            45-Min Pacing Timer
            {isTimerRunning && (
              <span style={{
                background: '#f43f5e',
                color: '#fff',
                padding: '1px 6px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 700
              }}>
                LIVE
              </span>
            )}
          </button>
          <button
            className={`nav-tab ${activeTab === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculator')}
          >
            <Calculator size={15} />
            Anchor Math Calc
          </button>
          <button
            className={`nav-tab ${activeTab === 'primitives' ? 'active' : ''}`}
            onClick={() => setActiveTab('primitives')}
          >
            <Zap size={15} />
            Core Primitives
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: 5 HIGH-YIELD ARCHETYPES
         ========================================================================= */}
      {activeTab === 'archetypes' && (
        <div>
          {/* Top Quick-Navigation Pills */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '18px'
          }}>
            <div style={{ position: 'relative', minWidth: '280px', flex: '1 1 300px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Search by archetype, company tag (Twitter, Uber, WhatsApp)..."
                value={archetypeSearch}
                onChange={(e) => setArchetypeSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  color: 'var(--text-main)',
                  fontSize: '13.5px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {archetypes.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    setExpandedArchetypeId(a.id);
                    setArchetypeSearch('');
                  }}
                  style={{
                    background: expandedArchetypeId === a.id ? 'var(--accent-blue)' : 'var(--bg-card)',
                    color: expandedArchetypeId === a.id ? '#fff' : 'var(--text-muted)',
                    border: '1px solid var(--border-color)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {a.category.split(':')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Archetypes List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {filteredArchetypes.map((arch) => {
              const isExpanded = expandedArchetypeId === arch.id;
              return (
                <div
                  key={arch.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: `1.5px solid ${isExpanded ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                    borderRadius: '14px',
                    padding: '24px',
                    transition: 'all 0.2s ease',
                    boxShadow: isExpanded ? '0 4px 25px rgba(59, 130, 246, 0.15)' : 'none'
                  }}
                >
                  {/* Card Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      cursor: 'pointer',
                      gap: '14px'
                    }}
                    onClick={() => setExpandedArchetypeId(isExpanded ? null : arch.id)}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(59, 130, 246, 0.18)',
                          color: 'var(--accent-blue)',
                          letterSpacing: '0.5px'
                        }}>
                          {arch.category}
                        </span>
                        {arch.interviewsMapped?.map((prompt, pIdx) => (
                          <span
                            key={pIdx}
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: 'var(--bg-input)',
                              color: 'var(--text-muted)',
                              border: '1px solid var(--border-color)'
                            }}
                          >
                            {prompt}
                          </span>
                        ))}
                      </div>

                      <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                        {arch.title}
                      </h3>

                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--text-muted)' }}>
                        <div>
                          <strong style={{ color: 'var(--text-main)' }}>Production Scale:</strong> {arch.scale}
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn-link"
                      style={{
                        padding: '8px',
                        borderRadius: '50%',
                        flexShrink: 0,
                        background: isExpanded ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                        color: isExpanded ? 'var(--accent-blue)' : 'var(--text-muted)'
                      }}
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>

                  {/* Expanded Blueprint Details */}
                  {isExpanded && (
                    <div style={{ marginTop: '22px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      {/* Problem Statement */}
                      <div style={{ background: 'var(--bg-input)', padding: '14px 18px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '4px' }}>
                          Core Problem Statement
                        </span>
                        <p style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: 1.5 }}>
                          {arch.problemStatement}
                        </p>
                      </div>

                      {/* Critical Trade-Off Box */}
                      <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '16px 18px', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.35)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <AlertTriangle size={16} color="#f59e0b" />
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                            Core Trade-Off Articulation (Interviewer Evaluation Point)
                          </span>
                        </div>
                        <p style={{ fontSize: '13.5px', color: '#fef3c7', lineHeight: 1.6 }}>
                          {arch.coreTradeOff}
                        </p>
                      </div>

                      {/* Solution Architecture Pipeline */}
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '10px' }}>
                          End-to-End Architectural Pipeline
                        </span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                          {Object.entries(arch.solutionArchitecture).map(([phaseKey, phaseDesc]) => (
                            <div
                              key={phaseKey}
                              style={{
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '10px',
                                padding: '14px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-blue)' }} />
                                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'capitalize' }}>
                                  {phaseKey.replace(/([A-Z])/g, ' $1')}
                                </span>
                              </div>
                              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                {phaseDesc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Failure Modes & Disaster Mitigation */}
                      <div style={{ background: 'rgba(244, 63, 94, 0.06)', padding: '16px 18px', borderRadius: '10px', border: '1px solid rgba(244, 63, 94, 0.25)' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '8px' }}>
                          Failure Modes & What Breaks at 10x Scale
                        </span>
                        <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#fecdd3', lineHeight: 1.6 }}>
                          {arch.failureModes?.map((fm, fIdx) => (
                            <li key={fIdx}>{fm}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Anchor Hardware Metrics */}
                      <div style={{ background: 'var(--bg-card)', padding: '12px 16px', borderRadius: '8px', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <HardDrive size={18} color="var(--accent-blue)" />
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          <strong style={{ color: '#fff' }}>Back-of-the-Envelope Hardware Anchor:</strong> {arch.keyNumbers}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: 4-PHASE PROGRESSION ROADMAP (WEEKS 1–8+)
         ========================================================================= */}
      {activeTab === 'progression' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Progress Overview Bar */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff' }}>
                System Design Progression Mastery
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Track your study readiness across the 4 foundational phases. Check off concepts once you can articulate their trade-offs without notes.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981' }}>
                  {masteredCount} / {allTopicNames.length}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>TOPICS MASTERED</div>
              </div>
              <div style={{ width: '120px', height: '10px', background: 'var(--bg-input)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${masteryPercent}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #3b82f6)', transition: 'width 0.3s' }} />
              </div>
            </div>
          </div>

          {/* Phases Accordion / List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {progressionPlan.map((phaseItem, pIdx) => (
              <div
                key={pIdx}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '22px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      background: 'var(--accent-gradient)',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '6px'
                    }}>
                      {phaseItem.badge}
                    </span>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>
                      {phaseItem.phase}
                    </h3>
                  </div>

                  <span style={{ fontSize: '12px', color: 'var(--accent-blue)', fontWeight: 600 }}>
                    {phaseItem.focus}
                  </span>
                </div>

                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  {phaseItem.goal}
                </p>

                {/* Topics Grid with Checkboxes */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                  {phaseItem.topics?.map((topic, tIdx) => {
                    const isDone = !!masteredTopics[topic.name];
                    return (
                      <div
                        key={tIdx}
                        onClick={() => toggleTopicMastery(topic.name)}
                        style={{
                          background: isDone ? 'rgba(16, 185, 129, 0.06)' : 'var(--bg-input)',
                          border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)'}`,
                          borderRadius: '10px',
                          padding: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <button
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: isDone ? '#10b981' : 'var(--text-dim)',
                            cursor: 'pointer',
                            marginTop: '2px',
                            padding: 0
                          }}
                        >
                          {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                        </button>

                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: isDone ? '#10b981' : '#fff',
                            textDecoration: isDone ? 'line-through' : 'none',
                            marginBottom: '4px'
                          }}>
                            {topic.name}
                          </div>
                          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            {topic.details}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: 45-MINUTE INTERVIEW PACING TIMER & FRAMEWORK
         ========================================================================= */}
      {activeTab === 'timer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Live Timer Dashboard */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--accent-blue)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--accent-glow)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-blue)', letterSpacing: '1px' }}>
                  Real-Time Big Tech Mock Simulation
                </span>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                  45-Minute Execution Cockpit
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Strict pacing prevents the #1 failure mode in L5/L6 interviews: getting bogged down in requirements and running out of time for deep dives.
                </div>
              </div>

              {/* Big Digital Clock & Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '44px',
                  fontWeight: 800,
                  color: secondsRemaining <= 300 ? '#f43f5e' : '#fff',
                  background: 'var(--bg-input)',
                  padding: '8px 20px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  letterSpacing: '2px'
                }}>
                  {formatTime(secondsRemaining)}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    style={{
                      background: isTimerRunning ? '#f59e0b' : '#10b981',
                      color: '#fff',
                      border: 'none',
                      padding: '12px 18px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px'
                    }}
                  >
                    {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                    {isTimerRunning ? 'Pause' : 'Start'}
                  </button>

                  <button
                    onClick={resetTimer}
                    title="Reset to 45:00"
                    style={{
                      background: 'var(--bg-input)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                      padding: '12px',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Stepper Timeline Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '7fr 3fr 10fr 18fr 7fr',
                gap: '4px',
                height: '8px',
                background: 'var(--bg-input)',
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                {framework.map((step, idx) => {
                  const isCurrent = currentPhaseIndex === idx;
                  const isPassed = currentPhaseIndex > idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => jumpToPhase(idx)}
                      title={`${step.step} (${step.duration}) - Click to jump`}
                      style={{
                        background: isCurrent ? 'var(--accent-blue)' : (isPassed ? '#10b981' : 'rgba(255,255,255,0.08)'),
                        cursor: 'pointer',
                        transition: 'background 0.3s'
                      }}
                    />
                  );
                })}
              </div>

              {/* Phase Step Clickable Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginTop: '6px' }}>
                {framework.map((step, idx) => {
                  const isCurrent = currentPhaseIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => jumpToPhase(idx)}
                      style={{
                        background: isCurrent ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                        border: `1px solid ${isCurrent ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                        borderRadius: '8px',
                        padding: '8px 10px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '10px', fontWeight: 800, color: isCurrent ? 'var(--accent-blue)' : 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Phase {idx + 1} ({step.duration})
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: isCurrent ? '#fff' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {step.step.split(':')[1]?.trim() || step.step}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Phase Deep Dive Card */}
          {framework[currentPhaseIndex] && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{
                  background: 'var(--accent-gradient)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '6px'
                }}>
                  CURRENT STAGE
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
                  {framework[currentPhaseIndex].step} ({framework[currentPhaseIndex].duration})
                </h3>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                {framework[currentPhaseIndex].description}
              </p>

              {/* Execution Checklist */}
              <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '8px' }}>
                  Execution Checklist: What To Say & Ask
                </span>
                <ul style={{ paddingLeft: '20px', fontSize: '13.5px', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  {framework[currentPhaseIndex].keyQuestions?.map((q, qIdx) => (
                    <li key={qIdx} style={{ marginBottom: '4px' }}>{q}</li>
                  ))}
                </ul>
              </div>

              {/* Anti-Patterns To Avoid */}
              {framework[currentPhaseIndex].antiPatterns && (
                <div style={{ background: 'rgba(244, 63, 94, 0.08)', padding: '14px 16px', borderRadius: '10px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <AlertTriangle size={15} color="#f43f5e" />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                      Fatal Anti-Patterns in this Stage
                    </span>
                  </div>
                  <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#fecdd3', lineHeight: 1.5 }}>
                    {framework[currentPhaseIndex].antiPatterns.map((ap, apIdx) => (
                      <li key={apIdx}>{ap}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 4: ANCHOR MATH CALCULATOR & REFERENCE CHEAT SHEET
         ========================================================================= */}
      {activeTab === 'calculator' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Interactive Calculator Card */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
                  Anchor Back-of-the-Envelope Calculator
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Simulate QPS, peak throughput, network bandwidth, 5-year storage, and 80/20 RAM cache constraints in real time.
                </p>
              </div>

              {/* 1-Click Presets */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)', alignSelf: 'center', fontWeight: 600 }}>Presets:</span>
                <button
                  onClick={() => applyCalcPreset('twitter')}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                >
                  Twitter/X (300M DAU)
                </button>
                <button
                  onClick={() => applyCalcPreset('uber')}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                >
                  Uber (50M DAU)
                </button>
                <button
                  onClick={() => applyCalcPreset('whatsapp')}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                >
                  WhatsApp (500M DAU)
                </button>
                <button
                  onClick={() => applyCalcPreset('metrics')}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                >
                  Telemetry/Metrics (1M Nodes)
                </button>
              </div>
            </div>

            {/* Inputs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '22px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Daily Active Users (DAU)
                </label>
                <input
                  type="number"
                  value={calcDau}
                  onChange={(e) => setCalcDau(Math.max(1, Number(e.target.value)))}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Reads / User / Day
                </label>
                <input
                  type="number"
                  value={calcReadsPerUser}
                  onChange={(e) => setCalcReadsPerUser(Math.max(0, Number(e.target.value)))}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Writes / User / Day
                </label>
                <input
                  type="number"
                  value={calcWritesPerUser}
                  onChange={(e) => setCalcWritesPerUser(Math.max(0, Number(e.target.value)))}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Write Payload (KB)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcWriteSizeKb}
                  onChange={(e) => setCalcWriteSizeKb(Math.max(0.1, Number(e.target.value)))}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Read Payload (KB)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcReadSizeKb}
                  onChange={(e) => setCalcReadSizeKb(Math.max(0.1, Number(e.target.value)))}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Peak Traffic Multiplier
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={calcPeakMult}
                  onChange={(e) => setCalcPeakMult(Math.max(1, Number(e.target.value)))}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', fontSize: '14px' }}
                />
              </div>
            </div>

            {/* Calculated Results Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              {/* Card 1: QPS */}
              <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '18px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Throughput (QPS)
                </span>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
                  {totalQps.toLocaleString()} <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>avg</span>
                </div>
                <div style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
                  <div>Reads: <strong style={{ color: '#ffffff' }}>{readQps.toLocaleString()}</strong> QPS</div>
                  <div>Writes: <strong style={{ color: '#ffffff' }}>{writeQps.toLocaleString()}</strong> QPS</div>
                  <div style={{ color: '#ff9f0a', fontWeight: 600, marginTop: '2px' }}>
                    Peak ({calcPeakMult}x): {peakQps.toLocaleString()} QPS
                  </div>
                </div>
              </div>

              {/* Card 2: Bandwidth */}
              <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                  Network Bandwidth
                </span>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                  {egressGbps} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Gbps egress</span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <div>Egress: <strong>{egressMbPerSec}</strong> MB/s</div>
                  <div>Ingress: <strong>{ingressMbPerSec}</strong> MB/s ({ingressGbps} Gbps)</div>
                </div>
              </div>

              {/* Card 3: Storage */}
              <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase' }}>
                  Storage ({calcRetentionYears} Years)
                </span>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                  {multiYearStorageTb} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>TB</span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <div>Daily Writes: <strong>{dailyWriteGb.toFixed(1)}</strong> GB/day</div>
                  <div>Yearly Writes: <strong>{yearlyWriteTb.toFixed(1)}</strong> TB/year</div>
                </div>
              </div>

              {/* Card 4: Redis Cache 80/20 */}
              <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#f43f5e', textTransform: 'uppercase' }}>
                  Cache RAM (80/20 Rule)
                </span>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                  {cacheWorkingSetGb} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>GB RAM</span>
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <div>20% of daily reads cached in memory</div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '11px', marginTop: '2px' }}>
                    ~{Math.ceil(Number(cacheWorkingSetGb) / 32)} x 32GB Redis nodes
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Anchor Numbers & Rules of Thumb */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} color="var(--accent-blue)" />
                Anchor Mental Math Constants
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {anchorNumbers.rulesOfThumb?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.metric}</span>
                    <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{item.equivalent}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Latency Numbers Every Programmer Should Know */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} color="#10b981" />
                Latency Numbers Every Engineer Must Know
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {anchorNumbers.latencyReference?.slice(0, 7).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.operation}</span>
                    <strong style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>{item.latency}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: CORE PRIMITIVES & DISTRIBUTED THEORY
         ========================================================================= */}
      {activeTab === 'primitives' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
          {cheatSheet.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '22px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Database size={18} color="var(--accent-blue)" />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{item.topic}</h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {item.takeaway}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
