import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api/client';
import ProblemCard from '../components/ProblemCard';
import RewardToast from '../components/RewardToast';
import { Search, ChevronLeft, ChevronRight, X, BookOpen, Calendar, Clock, Layers, CheckCircle2 } from 'lucide-react';

export default function ProblemBankPage() {
  const [problems, setProblems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ completedCount: 0, totalCount: 455 });
  const [smartFilter, setSmartFilter] = useState('all'); // 'all' | 'today' | 'scheduled' | 'completed'
  const [rewardToast, setRewardToast] = useState({ visible: false, title: '', message: '', badge: '', difficulty: '' });

  // Filters
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [topic, setTopic] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [track, setTrack] = useState('all');

  const debounceTimerRef = useRef(null);

  const topicsList = [
    'All',
    'Basics & Maths',
    'Sorting',
    'Arrays',
    'Binary Search',
    'Strings',
    'Linked List',
    'Recursion & Backtracking',
    'Bit Manipulation',
    'Stack & Queue',
    'Sliding Window & Two Pointer',
    'Heaps',
    'Greedy Algorithms',
    'Binary Trees',
    'Binary Search Trees',
    'Graphs',
    'Dynamic Programming',
    'Trie'
  ];

  // Load progress stats for Apple Reminders smart tiles
  useEffect(() => {
    api.getProgressStats()
      .then(res => {
        if (res) setStats(res);
      })
      .catch(console.error);
  }, []);

  // Debounce search input
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 280);
  };

  const clearSearch = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setPage(1);
  };

  const handleSmartFilter = (type) => {
    setSmartFilter(type);
    setPage(1);
    if (type === 'all') {
      setTrack('all');
      setTopic('All');
      setDifficulty('All');
    } else if (type === 'today') {
      setTrack('intermediate');
      setTopic('All');
      setDifficulty('All');
    } else if (type === 'scheduled') {
      setTrack('all');
    } else if (type === 'completed') {
      // Completed filter
    }
  };

  const loadProblems = () => {
    setLoading(true);
    api.getProblems({
      page,
      limit,
      search: debouncedSearch,
      topic: topic === 'All' ? '' : topic,
      difficulty: difficulty === 'All' ? '' : difficulty,
      track
    })
      .then(res => {
        setProblems(res.problems || []);
        setTotal(res.total || 0);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProblems();
  }, [page, limit, debouncedSearch, topic, difficulty, track, smartFilter]);

  // Optimistic UI toggle for instant responsiveness
  const handleToggle = async (sequenceOrder, details) => {
    const previousProblems = [...problems];
    const targetProb = problems.find(p => p.sequenceOrder === sequenceOrder);
    const willBeCompleted = targetProb ? !targetProb.isCompleted : true;

    if (willBeCompleted && targetProb) {
      const diff = targetProb.difficulty || 'Medium';
      const msgs = {
        Easy: 'Foundational pattern locked into muscle memory! Speed and syntax reinforced.',
        Medium: 'High-Yield Meta/Google interview favorite conquered! Synaptic pathways strengthened.',
        Hard: 'Elite L5+ breakthrough! You outworked 95% of candidates on this problem.'
      };
      setRewardToast({
        visible: true,
        title: `${diff} Problem Conquered!`,
        message: msgs[diff] || 'Progress recorded into your personal catalog.',
        badge: '+1 Solved',
        difficulty: diff
      });
    }

    setProblems(prev => prev.map(p => {
      if (p.sequenceOrder === sequenceOrder) {
        const nextCompleted = !p.isCompleted;
        setStats(s => ({
          ...s,
          completedCount: s.completedCount + (nextCompleted ? 1 : -1)
        }));
        return {
          ...p,
          isCompleted: nextCompleted,
          progressDetails: nextCompleted ? details : null
        };
      }
      return p;
    }));

    try {
      await api.toggleProgress(sequenceOrder, details);
    } catch (err) {
      setProblems(previousProblems);
      alert('Failed to update progress: ' + err.message);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Dopamine Micro-Celebration Toast */}
      <RewardToast
        toast={rewardToast}
        onDismiss={() => setRewardToast(prev => ({ ...prev, visible: false }))}
      />

      <div className="section-header" style={{ marginBottom: '22px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <BookOpen size={18} color="var(--accent-blue)" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Universal Curriculum
            </span>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', color: '#ffffff' }}>
            Striver A2Z Problem Bank
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
            All 455 problems mapped to LeetCode, GeeksForGeeks, TakeUForward editorials, and video solutions.
          </p>
        </div>
        <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Showing <strong style={{ color: '#ffffff', fontVariantNumeric: 'tabular-nums' }}>{total}</strong> problems
        </div>
      </div>

      {/* Apple Reminders 4-Box Smart List Filter Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '14px',
        marginBottom: '24px'
      }}>
        {/* Tile 1: Today */}
        <div
          onClick={() => handleSmartFilter('today')}
          style={{
            background: smartFilter === 'today' ? 'rgba(41, 151, 255, 0.16)' : 'var(--bg-surface)',
            border: `1.5px solid ${smartFilter === 'today' ? 'var(--accent-blue)' : 'var(--border-color)'}`,
            borderRadius: '16px',
            padding: '16px',
            cursor: 'pointer',
            transition: 'all var(--duration) var(--ease)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(41, 151, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={16} color="#2997ff" />
            </div>
            <span style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              4
            </span>
          </div>
          <span style={{ fontSize: '13.5px', fontWeight: 600, color: smartFilter === 'today' ? '#ffffff' : 'var(--text-muted)' }}>
            Today
          </span>
        </div>

        {/* Tile 2: Scheduled */}
        <div
          onClick={() => handleSmartFilter('scheduled')}
          style={{
            background: smartFilter === 'scheduled' ? 'rgba(255, 159, 10, 0.16)' : 'var(--bg-surface)',
            border: `1.5px solid ${smartFilter === 'scheduled' ? 'var(--color-medium)' : 'var(--border-color)'}`,
            borderRadius: '16px',
            padding: '16px',
            cursor: 'pointer',
            transition: 'all var(--duration) var(--ease)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255, 159, 10, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={16} color="#ff9f0a" />
            </div>
            <span style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {Math.max(0, 455 - (stats.completedCount || 0))}
            </span>
          </div>
          <span style={{ fontSize: '13.5px', fontWeight: 600, color: smartFilter === 'scheduled' ? '#ffffff' : 'var(--text-muted)' }}>
            Scheduled
          </span>
        </div>

        {/* Tile 3: All Striver */}
        <div
          onClick={() => handleSmartFilter('all')}
          style={{
            background: smartFilter === 'all' ? 'rgba(255, 255, 255, 0.1)' : 'var(--bg-surface)',
            border: `1.5px solid ${smartFilter === 'all' ? 'rgba(255, 255, 255, 0.35)' : 'var(--border-color)'}`,
            borderRadius: '16px',
            padding: '16px',
            cursor: 'pointer',
            transition: 'all var(--duration) var(--ease)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={16} color="#d2d2d7" />
            </div>
            <span style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              455
            </span>
          </div>
          <span style={{ fontSize: '13.5px', fontWeight: 600, color: smartFilter === 'all' ? '#ffffff' : 'var(--text-muted)' }}>
            All
          </span>
        </div>

        {/* Tile 4: Completed */}
        <div
          onClick={() => handleSmartFilter('completed')}
          style={{
            background: smartFilter === 'completed' ? 'rgba(48, 209, 88, 0.16)' : 'var(--bg-surface)',
            border: `1.5px solid ${smartFilter === 'completed' ? 'var(--color-easy)' : 'var(--border-color)'}`,
            borderRadius: '16px',
            padding: '16px',
            cursor: 'pointer',
            transition: 'all var(--duration) var(--ease)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(48, 209, 88, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={16} color="#30d158" />
            </div>
            <span style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {stats.completedCount || 0}
            </span>
          </div>
          <span style={{ fontSize: '13.5px', fontWeight: 600, color: smartFilter === 'completed' ? '#ffffff' : 'var(--text-muted)' }}>
            Completed
          </span>
        </div>
      </div>

      {/* Filter Bar with Live Debounced Search */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-card)',
        padding: '18px 22px',
        marginBottom: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        backdropFilter: 'var(--glass-blur)'
      }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search problems, topics, algorithms (e.g. 'Two Sum', 'DP', 'Koko')..."
            value={searchInput}
            onChange={handleSearchChange}
            className="input-field"
            style={{
              paddingLeft: '38px',
              paddingRight: searchInput ? '38px' : '14px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(255, 255, 255, 0.04)',
              fontSize: '14px'
            }}
          />
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          {searchInput && (
            <button
              onClick={clearSearch}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Track Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Track:</span>
              <select
                value={track}
                onChange={(e) => { setTrack(e.target.value); setPage(1); }}
                className="input-field"
                style={{ padding: '6px 14px', fontSize: '13px', width: 'auto', borderRadius: 'var(--radius-pill)' }}
              >
                <option value="all">All 455 Problems</option>
                <option value="beginner">Track 1: Beginner (L3)</option>
                <option value="intermediate">Track 2: Intermediate (L4)</option>
                <option value="advanced">Track 3: Advanced (L5)</option>
                <option value="elite">Track 4: Elite (L6+/CP)</option>
              </select>
            </div>

            {/* Topic Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Topic:</span>
              <select
                value={topic}
                onChange={(e) => { setTopic(e.target.value); setPage(1); }}
                className="input-field"
                style={{ padding: '6px 14px', fontSize: '13px', width: 'auto', borderRadius: 'var(--radius-pill)' }}
              >
                {topicsList.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Difficulty:</span>
              <select
                value={difficulty}
                onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
                className="input-field"
                style={{ padding: '6px 14px', fontSize: '13px', width: 'auto', borderRadius: 'var(--radius-pill)' }}
              >
                <option value="All">All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Page Limit Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Per Page:</span>
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="input-field"
              style={{ padding: '6px 12px', fontSize: '13px', width: 'auto', borderRadius: 'var(--radius-pill)' }}
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problem Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontSize: '14px' }}>Loading problems...</div>
      ) : problems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--text-muted)',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--border-color)',
          fontSize: '14px'
        }}>
          No problems match the current filter criteria.
        </div>
      ) : (
        <div>
          {problems.map((prob) => (
            <ProblemCard
              key={prob.sequenceOrder}
              problem={prob}
              onToggle={handleToggle}
            />
          ))}

          {/* Pagination Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '24px',
            padding: '12px 20px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-pill)'
          }}>
            <button
              className="btn-link"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                opacity: page === 1 ? 0.35 : 1,
                cursor: page === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
              Page <strong style={{ color: '#ffffff' }}>{page}</strong> of <strong style={{ color: '#ffffff' }}>{totalPages}</strong>
            </span>

            <button
              className="btn-link"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                opacity: page === totalPages ? 0.35 : 1,
                cursor: page === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
