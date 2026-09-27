import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { ExternalLink, CheckCircle2, BookOpen } from 'lucide-react';

export default function TrackMatrix() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('comparison'); // 'comparison' | 'phases' | 'curated' | 'dp'

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
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading track matrix...</div>;
  }

  const tracks = data?.tracks || [];
  const checklist = data?.track2CuratedChecklist || [];

  return (
    <div style={{ marginTop: '20px' }}>
      <div className="section-header" style={{ marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>FAANG Track Comparison & Curricula</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Choose your baseline level and follow the calibrated roadmap.
          </p>
        </div>

        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            Track Comparison
          </button>
          <button
            className={`nav-tab ${activeTab === 'phases' ? 'active' : ''}`}
            onClick={() => setActiveTab('phases')}
          >
            Phase Roadmaps
          </button>
          <button
            className={`nav-tab ${activeTab === 'curated' ? 'active' : ''}`}
            onClick={() => setActiveTab('curated')}
          >
            Track 2 Checklist
          </button>
          <button
            className={`nav-tab ${activeTab === 'dp' ? 'active' : ''}`}
            onClick={() => setActiveTab('dp')}
          >
            DP Deep Dive
          </button>
        </div>
      </div>

      {activeTab === 'comparison' && (
        <div style={{ overflowX: 'auto', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px', fontWeight: 700 }}>Track</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>Target Audience</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>Prerequisites</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>Target Problem Mix</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>Volume Target</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>Daily Commitment</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((t, idx) => (
                <tr key={t.id} style={{ borderBottom: idx !== tracks.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <td style={{ padding: '16px', fontWeight: 700, color: 'var(--accent-blue)' }}>
                    {t.name}
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>{t.subtitle}</div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-main)' }}>{t.targetAudience}</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{t.prerequisites}</td>
                  <td style={{ padding: '16px', fontWeight: 600 }}>{t.targetMix}</td>
                  <td style={{ padding: '16px', color: 'var(--color-easy)', fontWeight: 700 }}>{t.volumeTarget}</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{t.dailyCommitment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'phases' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {tracks.map((t) => (
            <div key={t.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-blue)' }}>{t.name}</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>{t.goal}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {t.phases?.map((p, pIdx) => (
                  <div key={pIdx} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#fff', marginBottom: '4px' }}>
                      {p.phase}: {p.title}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {p.topics}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'curated' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Track 2 (Intermediate): 28-Day Curated LeetCode Checklist</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              2 high-yield Medium-difficulty problems per day moving systematically from pointer manipulation to graph algorithms and dynamic programming.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Day</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Focus / Pattern</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Primary Problem</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Secondary Problem</th>
                </tr>
              </thead>
              <tbody>
                {checklist.map((row) => (
                  <tr key={row.day} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: 'var(--accent-blue)' }}>Day {row.day}</td>
                    <td style={{ padding: '12px', color: 'var(--text-main)', fontWeight: 500 }}>{row.focus}</td>
                    <td style={{ padding: '12px' }}>
                      <a href={row.lcPrimary} target="_blank" rel="noreferrer" style={{ color: '#ffa116', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        {row.primary} <ExternalLink size={12} />
                      </a>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <a href={row.lcSecondary} target="_blank" rel="noreferrer" style={{ color: '#ffa116', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        {row.secondary} <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'dp' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Week 4 Dynamic Programming: Explicit State Definitions & Base Cases</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
              Mastering formal DP recurrence relations eliminates pattern blindness in FAANG technical screens.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 1. Money Change */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: '#3b82f6', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>1. Money Change (Minimum Coins / Coin Change)</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Find minimum number of coins needed to make change for amount M given denominations C = {'{c1, c2, ..., ck}'}.
              </p>
              <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                <div><strong>State Definition:</strong> <code>dp[m]</code> = minimum number of coins needed to form exact total value <code>m</code> (0 &le; m &le; M).</div>
                <div><strong>Base Case:</strong> <code>dp[0] = 0</code>; <code>dp[m] = &infin;</code> for all m &gt; 0.</div>
                <div><strong>Recurrence:</strong> <code>dp[m] = min&#123; dp[m - c] + 1 &#125;</code> for all c &isin; C where c &le; m.</div>
                <div><strong>Goal State:</strong> <code>dp[M]</code></div>
              </div>
            </div>

            {/* 2. Primitive Calculator */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--color-easy)', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>2. Primitive Calculator</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Given integer n, find minimum operations to reach n starting from 1 using only: +1, &times;2, or &times;3.
              </p>
              <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                <div><strong>State Definition:</strong> <code>dp[i]</code> = minimum operations required to transition from 1 to integer <code>i</code> (1 &le; i &le; n).</div>
                <div><strong>Base Case:</strong> <code>dp[1] = 0</code>.</div>
                <div><strong>Recurrence:</strong> <code>dp[i] = 1 + min(dp[i-1], (i%2==0 ? dp[i/2] : &infin;), (i%3==0 ? dp[i/3] : &infin;))</code>.</div>
                <div><strong>Goal State:</strong> <code>dp[n]</code></div>
              </div>
            </div>

            {/* 3. Edit Distance */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--color-medium)', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>3. Edit Distance (Levenshtein Distance)</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Minimum insertions, deletions, and substitutions to transform string A[1..n] into B[1..m].
              </p>
              <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                <div><strong>State Definition:</strong> <code>dp[i][j]</code> = minimum edit distance between prefix A[1..i] and prefix B[1..j].</div>
                <div><strong>Base Cases:</strong> <code>dp[i][0] = i</code> (i deletions); <code>dp[0][j] = j</code> (j insertions).</div>
                <div><strong>Recurrence:</strong> <code>dp[i][j] = min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + (A[i] === B[j] ? 0 : 1))</code>.</div>
                <div><strong>Goal State:</strong> <code>dp[n][m]</code></div>
              </div>
            </div>

            {/* 4. Longest Common Subsequence */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--accent-blue)', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>4. Longest Common Subsequence (LCS)</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Find maximum length of a common subsequence between sequence A[1..n] and sequence B[1..m].
              </p>
              <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                <div><strong>State Definition:</strong> <code>dp[i][j]</code> = length of LCS of prefixes A[1..i] and B[1..j].</div>
                <div><strong>Base Cases:</strong> <code>dp[i][0] = 0</code>; <code>dp[0][j] = 0</code>.</div>
                <div><strong>Recurrence:</strong> If <code>A[i] === B[j]</code>: <code>dp[i][j] = 1 + dp[i-1][j-1]</code>. Else: <code>dp[i][j] = max(dp[i-1][j], dp[i][j-1])</code>.</div>
                <div><strong>Goal State:</strong> <code>dp[n][m]</code></div>
              </div>
            </div>

            {/* 5. 0/1 Knapsack */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--color-hard)', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>5. 0/1 Knapsack (Without Repetition)</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Maximize value of items in knapsack of capacity W, given n items with weights wi and values vi.
              </p>
              <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                <div><strong>State Definition:</strong> <code>dp[i][w]</code> = max value achievable considering subset of first i items under weight limit w.</div>
                <div><strong>Base Cases:</strong> <code>dp[0][w] = 0</code>; <code>dp[i][0] = 0</code>.</div>
                <div><strong>Recurrence:</strong> If <code>wi &gt; w</code>: <code>dp[i][w] = dp[i-1][w]</code>. Else: <code>dp[i][w] = max(dp[i-1][w], dp[i-1][w - wi] + vi)</code>.</div>
                <div><strong>Space Optimized:</strong> 1D array running backwards: <code>for w = W down to wi: dp[w] = max(dp[w], dp[w - wi] + vi)</code>.</div>
                <div><strong>Goal State:</strong> <code>dp[n][W]</code></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
