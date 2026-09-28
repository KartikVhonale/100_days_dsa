import React from 'react';
import { Target, Compass, BookOpen, Layers, Server, BarChart2, ArrowUp, ShieldCheck, Cpu, Sparkles } from 'lucide-react';

export default function Footer({ setActiveTab, onOpenTrackModal }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1: Brand & Behavioral Philosophy */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span className="brand-dot" />
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
                FAANG 100
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--text-muted)'
              }}>
                Striver × Todait
              </span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '340px', marginBottom: '16px' }}>
              Calibrated 100-day algorithmic preparation engine for Big Tech technical interviews. High-density pattern cataloging, pure discrete remainder scheduling, and active memory retention.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-easy)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-easy)' }} />
                <span>Todait Adaptive Engine: Active (Pure Scheduling Remainder)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-dim)' }}>
                <ShieldCheck size={13} color="var(--accent-blue)" />
                <span>Cryptographic JWT Auth & Isolated Progress Persistence</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <div className="footer-col-title">Navigation</div>
            <ul className="footer-nav-list">
              <li>
                <button type="button" className="footer-nav-btn" onClick={() => { setActiveTab('dashboard'); scrollToTop(); }}>
                  <Target size={13} />
                  <span>Today's Cockpit</span>
                </button>
              </li>
              <li>
                <button type="button" className="footer-nav-btn" onClick={() => { setActiveTab('roadmap'); scrollToTop(); }}>
                  <Compass size={13} />
                  <span>100-Day Roadmap</span>
                </button>
              </li>
              <li>
                <button type="button" className="footer-nav-btn" onClick={() => { setActiveTab('patterns'); scrollToTop(); }}>
                  <Layers size={13} />
                  <span>High-ROI Patterns</span>
                </button>
              </li>
              <li>
                <button type="button" className="footer-nav-btn" onClick={() => { setActiveTab('system-design'); scrollToTop(); }}>
                  <Server size={13} />
                  <span>System Design</span>
                </button>
              </li>
              <li>
                <button type="button" className="footer-nav-btn" onClick={() => { setActiveTab('problems'); scrollToTop(); }}>
                  <BookOpen size={13} />
                  <span>Curriculum (455)</span>
                </button>
              </li>
              <li>
                <button type="button" className="footer-nav-btn" onClick={() => { setActiveTab('matrix'); scrollToTop(); }}>
                  <BarChart2 size={13} />
                  <span>Track Matrix</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Calibrated Tracks */}
          <div>
            <div className="footer-col-title">Preparation Tracks</div>
            <ul className="footer-nav-list">
              <li>
                <button type="button" className="footer-nav-btn" onClick={() => { onOpenTrackModal(); }}>
                  <span>Track 1: Beginner</span>
                </button>
              </li>
              <li>
                <button type="button" className="footer-nav-btn" onClick={() => { onOpenTrackModal(); }}>
                  <span>Track 2: Intermediate</span>
                </button>
              </li>
              <li>
                <button type="button" className="footer-nav-btn" onClick={() => { onOpenTrackModal(); }}>
                  <span>Track 3: Advanced (L4/L5)</span>
                </button>
              </li>
              <li>
                <button type="button" className="footer-nav-btn" onClick={() => { onOpenTrackModal(); }}>
                  <span>Track 4: Elite / Staff CP</span>
                </button>
              </li>
              <li>
                <button type="button" className="footer-nav-btn" onClick={() => { onOpenTrackModal(); }} style={{ color: 'var(--accent-blue)' }}>
                  <span>Switch Current Track &rarr;</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Interview Rubrics & Benchmarks */}
          <div>
            <div className="footer-col-title">FAANG Alignment</div>
            <ul className="footer-nav-list">
              <li style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Meta E4/E5 Speed & Graph Drill
              </li>
              <li style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Google L4/L5 DP & Invariant Rigor
              </li>
              <li style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Amazon SDE II/III Architecture
              </li>
              <li style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Apple Core Primitives & Caching
              </li>
              <li style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Netflix Partitioning & Resiliency
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="footer-bottom">
          <div>
            &copy; 2026 FAANG 100 Preparation Platform. Built with Apple Developer Human Interface Standards.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="footer-nav-btn"
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-body)',
              fontWeight: 500,
              fontSize: '12px'
            }}
            title="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}
