import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Plus, Search, Copy, Check, ExternalLink, Timer, AlertCircle, Sparkles, BookOpen, Layers, Play, Pause, RotateCcw } from 'lucide-react';

export default function PatternCatalog() {
  const [activeTab, setActiveTab] = useState('high-roi'); // 'high-roi' | 'all-patterns'
  const [patterns, setPatterns] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // 25-minute interview timer state
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(s => s - 1), 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(25 * 60);
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Arrays & Pointers',
    signature: '',
    dataStructure: '',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    keyInsights: '',
    codeTemplate: ''
  });

  const loadPatterns = () => {
    setLoading(true);
    api.getPatterns({ search, category: category === 'All' ? '' : category })
      .then(res => {
        setPatterns(res || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPatterns();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadPatterns();
  };

  const handleCopyCode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreatePattern = async (e) => {
    e.preventDefault();
    try {
      await api.createPattern({
        ...formData,
        keyInsights: formData.keyInsights.split('\n').filter(s => s.trim() !== '')
      });
      setShowAddModal(false);
      setFormData({
        name: '',
        category: 'Arrays & Pointers',
        signature: '',
        dataStructure: '',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        keyInsights: '',
        codeTemplate: ''
      });
      loadPatterns();
    } catch (err) {
      alert(err.message);
    }
  };

  const highRoiCurriculum = [
    {
      category: 'Two Pointers',
      description: 'Foundational for optimizing O(N^2) brute force down to O(N) for sorted sequences and cycle detection.',
      primary: { title: '15. 3Sum', url: 'https://leetcode.com/problems/3sum/', role: 'Template' },
      secondary: { title: '11. Container With Most Water', url: 'https://leetcode.com/problems/container-with-most-water/', role: 'Test' },
      faangTwist: '"What if the array is too large to fit in memory?" (External chunked two-pointer streaming / external merge sort)',
      spaceOpt: 'O(1) extra space by sorting in-place and squeezing two pointers inward.'
    },
    {
      category: 'Sliding Window',
      description: 'Maintains optimal contiguous subarray/substring invariant with dynamic or fixed boundaries.',
      primary: { title: '3. Longest Substring Without Repeating Characters', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', role: 'Template' },
      secondary: { title: '76. Minimum Window Substring (Hard)', url: 'https://leetcode.com/problems/minimum-window-substring/', role: 'Test' },
      faangTwist: 'Character frequency counting with variable window shrinkage conditions and ASCII array maps.',
      spaceOpt: 'Use fixed 128-element integer array instead of hash map for O(1) space.'
    },
    {
      category: 'Binary Search (Modified & Answer Space)',
      description: 'Beyond sorted arrays: tests ability to binary search over abstract monotonically feasible answer spaces.',
      primary: { title: '33. Search in Rotated Sorted Array', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', role: 'Template' },
      secondary: { title: '875. Koko Eating Bananas', url: 'https://leetcode.com/problems/koko-eating-bananas/', role: 'Test' },
      faangTwist: 'Searching on mathematical answer space [low, high] with a boolean helper predicate instead of index arrays.',
      spaceOpt: 'O(1) auxiliary space strictly; eliminate integer overflow via mid = low + (high - low) / 2.'
    },
    {
      category: 'Tree DFS',
      description: 'The backbone of recursive subproblem decomposition, depth calculation, and lowest common ancestors.',
      primary: { title: '236. Lowest Common Ancestor of a Binary Tree', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', role: 'Template' },
      secondary: { title: '124. Binary Tree Maximum Path Sum (Hard)', url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', role: 'Test' },
      faangTwist: 'Tracking global state / path sums across recursive frames while returning local contributions.',
      spaceOpt: 'O(H) recursion stack space where H is tree height; Morris traversal for O(1) space.'
    },
    {
      category: 'Tree BFS',
      description: 'Essential for shortest path in unweighted graphs, level-by-level processing, and tree serialization.',
      primary: { title: '102. Binary Tree Level Order Traversal', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', role: 'Template' },
      secondary: { title: '297. Serialize and Deserialize Binary Tree (Hard)', url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', role: 'Test' },
      faangTwist: 'Transitioning from conceptual pointer trees to string representations and parsing streams without recursion limits.',
      spaceOpt: 'O(W) queue space where W is the maximum width of the binary tree.'
    },
    {
      category: 'Graph DFS / BFS',
      description: 'Matrix traversal, connected components, cycle detection in prerequisites, and topological sorting.',
      primary: { title: '200. Number of Islands', url: 'https://leetcode.com/problems/number-of-islands/', role: 'Template' },
      secondary: { title: '207. Course Schedule (Cycle Detection)', url: 'https://leetcode.com/problems/course-schedule/', role: 'Test' },
      faangTwist: '"What if the grid is distributed across multiple machines?" (MapReduce connected components / Union-Find over boundary nodes).',
      spaceOpt: 'In-place grid marking for O(1) auxiliary space, or Union-Find with path compression.'
    },
    {
      category: 'Heaps / Priority Queue',
      description: 'Crucial for Top-K frequent elements, streaming medians, and merging K sorted streams.',
      primary: { title: '347. Top K Frequent Elements', url: 'https://leetcode.com/problems/top-k-frequent-elements/', role: 'Template' },
      secondary: { title: '295. Find Median from Data Stream (Hard)', url: 'https://leetcode.com/problems/find-median-from-data-stream/', role: 'Test' },
      faangTwist: 'Using two heaps (max-heap for lower half, min-heap for upper half) simultaneously to balance a continuous stream.',
      spaceOpt: 'Maintain size K min-heap to keep space bounded strictly to O(K) rather than O(N).'
    },
    {
      category: 'Backtracking',
      description: 'Exhaustive state-space search for combinations, permutations, and constraint satisfaction.',
      primary: { title: '46. Permutations', url: 'https://leetcode.com/problems/permutations/', role: 'Template' },
      secondary: { title: '79. Word Search', url: 'https://leetcode.com/problems/word-search/', role: 'Test' },
      faangTwist: 'Pruning the search tree aggressively to avoid exponential explosion; in-place matrix backtracking without visited set.',
      spaceOpt: 'Mutate input character in-place (`board[r][c] = "#"`) to achieve O(1) auxiliary space.'
    },
    {
      category: '1D Dynamic Programming',
      description: 'Subproblem decomposition over sequential decisions, house robbing, and coin combinations.',
      primary: { title: '198. House Robber', url: 'https://leetcode.com/problems/house-robber/', role: 'Template' },
      secondary: { title: '322. Coin Change', url: 'https://leetcode.com/problems/coin-change/', role: 'Test' },
      faangTwist: 'Optimizing space complexity from O(N) array down to O(1) using two rolling state variables.',
      spaceOpt: 'Rolling variables `prev1` and `prev2` eliminate the array entirely for O(1) space.'
    },
    {
      category: '2D Dynamic Programming',
      description: 'Grid paths, string alignment, longest common subsequences, and edit distance.',
      primary: { title: '1143. Longest Common Subsequence', url: 'https://leetcode.com/problems/longest-common-subsequence/', role: 'Template' },
      secondary: { title: '72. Edit Distance (Hard)', url: 'https://leetcode.com/problems/edit-distance/', role: 'Test' },
      faangTwist: 'Backtracking through the 2D DP table to construct and print the actual string rather than just its length.',
      spaceOpt: 'Reduce 2D table O(N*M) down to two 1D rows `prevRow` and `currRow` for O(M) space.'
    }
  ];

  const categories = ['All', 'Arrays & Pointers', 'Arrays & Strings', 'Stack & Queue', 'Searching', 'Graphs', 'Dynamic Programming'];

  return (
    <div style={{ marginTop: '20px' }}>
      <div className="section-header" style={{ marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '26px', fontWeight: 800 }}>FAANG Algorithmic Patterns</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Mastering 6 to 8 core patterns yields over 80% coverage in Meta, Google, and Amazon technical screens.
          </p>
        </div>

        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'high-roi' ? 'active' : ''}`}
            onClick={() => setActiveTab('high-roi')}
          >
            <Sparkles size={15} />
            The High-ROI 75 Curriculum
          </button>
          <button
            className={`nav-tab ${activeTab === 'all-patterns' ? 'active' : ''}`}
            onClick={() => setActiveTab('all-patterns')}
          >
            <BookOpen size={15} />
            Pattern Playbook ({patterns.length})
          </button>
        </div>
      </div>

      {/* 25-Minute Rule & Execution Strategy Banner */}
      <div style={{ background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.08) 0%, var(--bg-card) 100%)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Timer size={18} color="var(--accent-blue)" />
              <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--accent-blue)' }}>
                The 25-Minute FAANG Rule
              </span>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-main)', maxWidth: '680px' }}>
              If you cannot formulate the optimal time complexity and loop invariant within 25 minutes, you have a pattern gap. Stop typing, read only the conceptual technique, and re-implement without hints.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-input)', padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: timerSeconds < 300 ? '#f43f5e' : '#fff' }}>
              {formatTimer(timerSeconds)}
            </span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="btn-primary"
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
              {isTimerRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetTimer}
              className="btn-link"
              style={{ padding: '6px 10px', fontSize: '12px' }}
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Dry Run Edge Cases Checklist */}
        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '12.5px', color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: 700, color: '#fff' }}>Mandatory Dry-Run Edge Cases:</span>
          <span>1. Empty sequence <code>[]</code></span>
          <span>2. Single element <code>[1]</code></span>
          <span>3. Duplicates & negatives <code>[-1, -1, 0, 1]</code></span>
          <span>4. Integer overflow boundaries <code>INT_MAX / 10</code></span>
        </div>
      </div>

      {/* High-ROI 75 Problem Curriculum Tab */}
      {activeTab === 'high-roi' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {highRoiCurriculum.map((p, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ background: 'var(--accent-gradient)', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                    Pattern #{idx + 1}
                  </span>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff' }}>{p.category}</h3>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--color-easy)', fontWeight: 600 }}>
                  Space Target: {p.spaceOpt.split(' ')[0]}
                </span>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{p.description}</p>

              {/* Primary vs Secondary Problem Duo */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Primary "Template" Problem
                  </div>
                  <a href={p.primary.url} target="_blank" rel="noreferrer" style={{ fontSize: '14px', fontWeight: 700, color: '#ffa116', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    {p.primary.title} <ExternalLink size={13} />
                  </a>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Solve first. Memorize the invariant and structure.
                  </div>
                </div>

                <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Secondary "Test" Problem
                  </div>
                  <a href={p.secondary.url} target="_blank" rel="noreferrer" style={{ fontSize: '14px', fontWeight: 700, color: '#ffa116', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    {p.secondary.title} <ExternalLink size={13} />
                  </a>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Solve under 25-minute timer without hints.
                  </div>
                </div>
              </div>

              {/* FAANG Twist & Space Optimization */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', lineHeight: 1.5 }}>
                <div>
                  <strong style={{ color: '#f59e0b' }}>FAANG Interview Follow-up / Twist: </strong>
                  <span style={{ color: '#e2e8f0' }}>{p.faangTwist}</span>
                </div>
                <div style={{ marginTop: '4px' }}>
                  <strong style={{ color: '#60a5fa' }}>Space Optimization Strategy: </strong>
                  <span style={{ color: 'var(--text-muted)' }}>{p.spaceOpt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All Patterns Playbook Tab */}
      {activeTab === 'all-patterns' && (
        <div>
          {/* Search & Filters */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <form onSubmit={handleSearchSubmit} style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search pattern signature, data structure, or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '38px' }}
              />
              <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </form>

            <button className="btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} /> Catalog Pattern
            </button>
          </div>

          {/* Pattern Cards List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading pattern playbook...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
              {patterns.map((pat) => (
                <div key={pat.id || pat._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--accent-blue)', fontWeight: 700 }}>
                        {pat.category}
                      </span>
                      <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-easy)' }}>
                        {pat.timeComplexity} • {pat.spaceComplexity}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff' }}>{pat.name}</h3>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Signature:</span>
                    <p style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '2px', lineHeight: 1.4 }}>
                      {pat.signature}
                    </p>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Data Structure:</span>
                    <p style={{ fontSize: '13px', color: '#93c5fd', marginTop: '2px' }}>
                      {pat.dataStructure}
                    </p>
                  </div>

                  {pat.codeTemplate && (
                    <div style={{ position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Template:</span>
                        <button
                          onClick={() => handleCopyCode(pat.id || pat._id, pat.codeTemplate)}
                          className="btn-link"
                          style={{ padding: '2px 8px', fontSize: '11px' }}
                        >
                          {copiedId === (pat.id || pat._id) ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                          {copiedId === (pat.id || pat._id) ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre style={{ maxHeight: '160px' }}>{pat.codeTemplate}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Pattern Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Catalog New Algorithmic Pattern</h2>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreatePattern}>
              <div className="input-group">
                <label className="input-label">Pattern Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Monotonic Queue for Sliding Window Maximum"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="input-group">
                  <label className="input-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Data Structure</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Deque maintaining decreasing order"
                    value={formData.dataStructure}
                    onChange={(e) => setFormData({ ...formData, dataStructure: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Problem Signature</label>
                <textarea
                  rows="2"
                  required
                  placeholder="When to apply this pattern..."
                  value={formData.signature}
                  onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Code Template</label>
                <textarea
                  rows="4"
                  placeholder="function template() { ... }"
                  value={formData.codeTemplate}
                  onChange={(e) => setFormData({ ...formData, codeTemplate: e.target.value })}
                  className="input-field"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-link" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Pattern</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
