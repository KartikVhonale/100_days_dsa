import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import TodaitCockpit from '../components/TodaitCockpit';
import DailyTemplate from '../components/DailyTemplate';
import SpacedRepetition from '../components/SpacedRepetition';
import ProblemCard from '../components/ProblemCard';
import RoutineModal from '../components/RoutineModal';
import RewardToast from '../components/RewardToast';
import { CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

export default function Dashboard({ onOpenTrackModal }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingSeq, setTogglingSeq] = useState(null);
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [rewardToast, setRewardToast] = useState({ visible: false, title: '', message: '', badge: '', difficulty: '' });

  const loadDailyPlan = () => {
    setLoading(true);
    setError(null);
    api.getDailyPlan()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Failed to connect to backend engine');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDailyPlan();
  }, []);

  const handleToggle = async (sequenceOrder, details) => {
    setTogglingSeq(sequenceOrder);
    try {
      const res = await api.toggleProgress(sequenceOrder, details);
      if (res && res.completed) {
        // Variable Reward Dopamine Loop (B.F. Skinner / Hook Model)
        const targetProb = (todayPlan?.problems || []).find(p => p.sequenceOrder === sequenceOrder);
        const diff = targetProb?.difficulty || 'Medium';
        const msgs = {
          Easy: 'Foundational pattern locked into muscle memory! Speed and syntax reinforced.',
          Medium: 'High-Yield Meta/Google interview favorite conquered! Synaptic pathways strengthened.',
          Hard: 'Elite L5+ breakthrough! You outworked 95% of candidates on this problem.'
        };
        setRewardToast({
          visible: true,
          title: `${diff} Problem Conquered!`,
          message: msgs[diff] || 'Progress recorded into your Todait daily quota.',
          badge: '+1 Solved',
          difficulty: diff
        });
      }
      const updated = await api.getDailyPlan();
      setData(updated);
    } catch (err) {
      alert('Failed to update problem: ' + err.message);
    } finally {
      setTogglingSeq(null);
    }
  };

  const handleSaveRoutine = async ({ activeDays, excludedDates }) => {
    try {
      await api.rebalancePlan(data?.user?.userId || 'default_candidate', { activeDays, excludedDates });
      loadDailyPlan();
    } catch (err) {
      alert('Failed to update study routine: ' + err.message);
    }
  };

  if (loading && !data) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)', fontSize: '15px' }}>
        Loading daily plan...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: 'rgba(255, 69, 58, 0.08)', border: '1px solid rgba(255, 69, 58, 0.25)', borderRadius: 'var(--radius-card)', padding: '24px', margin: '40px 0', textAlign: 'center' }}>
        <AlertCircle size={28} color="var(--color-hard)" style={{ margin: '0 auto 8px' }} />
        <h3 style={{ color: 'var(--color-hard)', fontSize: '17px', fontWeight: 600 }}>Connection Error</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>{error}</p>
        <button className="btn-primary" onClick={loadDailyPlan} style={{ marginTop: '14px' }}>
          Retry
        </button>
      </div>
    );
  }

  const { user, todaitEngine, todayPlan, dailyProtocol } = data;
  const problems = todayPlan?.problems || [];
  const memoryReview = todayPlan?.memoryReview || null;

  return (
    <div>
      {/* Dopamine Micro-Celebration Toast */}
      <RewardToast
        toast={rewardToast}
        onDismiss={() => setRewardToast(prev => ({ ...prev, visible: false }))}
      />

      {/* Todait Dynamic Minimalist Cockpit with Behavioral Psychology */}
      <TodaitCockpit
        todaitEngine={todaitEngine}
        user={user}
        onRefresh={loadDailyPlan}
        onOpenRoutineModal={() => setIsRoutineModalOpen(true)}
      />

      {/* Zeigarnik Effect: "Next Up In Your Queue" Immediate Action Card */}
      {problems.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(41, 151, 255, 0.1) 0%, rgba(94, 92, 230, 0.08) 100%)',
          border: '1.5px solid rgba(41, 151, 255, 0.35)',
          borderRadius: 'var(--radius-card)',
          padding: '16px 22px',
          marginBottom: '26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(20px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(41, 151, 255, 0.2)',
              border: '1px solid rgba(41, 151, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sparkles size={18} color="var(--accent-blue)" />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Next In Queue • Zero Friction Launch
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.015em', marginTop: '2px' }}>
                #{String(problems[0].sequenceOrder).padStart(3, '0')} • {problems[0].title}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Target: {problems[0].difficulty} • {problems[0].topic || 'Core Pattern'}
              </div>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={() => {
              const el = document.querySelector('.problem-card');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ padding: '8px 18px', fontSize: '13.5px', fontWeight: 600 }}
          >
            <span>Start Solving Now</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* 7-Day Spaced Repetition (Minimalist alert, hidden when caught up) */}
      <SpacedRepetition
        memoryReview={memoryReview}
        onReviewCompleted={loadDailyPlan}
      />

      {/* Daily 4-Stage Protocol Split */}
      <DailyTemplate protocol={dailyProtocol} />

      {/* Today's Problems Queue */}
      <section className="problems-section">
        <div className="section-header" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Problem Queue
            </h2>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
              ({problems.length} remaining)
            </span>
          </div>

          <div
            onClick={onOpenTrackModal}
            style={{ fontSize: '13px', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            Track: <strong style={{ color: '#ffffff' }}>{user.currentTrack.toUpperCase()}</strong>
          </div>
        </div>

        {problems.length === 0 ? (
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-card)',
            padding: '36px',
            textAlign: 'center'
          }}>
            <CheckCircle2 size={36} color="var(--color-easy)" style={{ margin: '0 auto 10px' }} />
            <div style={{ fontSize: '17px', fontWeight: 600, color: '#ffffff' }}>Daily Quota Completed</div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Your progress has been recorded. Review cataloged patterns or practice additional problems from the Problem Bank.
            </p>
          </div>
        ) : (
          <div>
            {problems.map((prob) => (
              <ProblemCard
                key={prob.sequenceOrder}
                problem={prob}
                onToggle={handleToggle}
                isToggling={togglingSeq === prob.sequenceOrder}
              />
            ))}
          </div>
        )}
      </section>

      {/* Routine & Blackout Dates Modal */}
      <RoutineModal
        isOpen={isRoutineModalOpen}
        onClose={() => setIsRoutineModalOpen(false)}
        user={user}
        onSaveRoutine={handleSaveRoutine}
      />
    </div>
  );
}
