import React, { useState } from 'react';
import { Target, Compass, BookOpen, Layers, BarChart2, Server, LogIn, LogOut, ChevronDown, User } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  currentTrack,
  onOpenTrackModal,
  currentUser,
  onOpenAuthModal,
  onLogout
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const trackLabels = {
    all: 'All 455',
    beginner: 'Track 1: Beginner',
    intermediate: 'Track 2: Intermediate',
    advanced: 'Track 3: Advanced',
    elite: 'Track 4: Elite'
  };

  const getInitials = (nameStr = '') => {
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (nameStr.slice(0, 2) || 'CA').toUpperCase();
  };

  return (
    <header className="navbar">
      <div className="nav-brand" onClick={() => setActiveTab('dashboard')}>
        <span className="brand-dot"></span>
        <span className="brand-title">FAANG 100</span>
        <span className="brand-badge">Striver × Todait</span>
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Target size={14} />
          Today
        </button>

        <button
          className={`nav-tab ${activeTab === 'roadmap' ? 'active' : ''}`}
          onClick={() => setActiveTab('roadmap')}
        >
          <Compass size={14} />
          Roadmap
        </button>

        <button
          className={`nav-tab ${activeTab === 'patterns' ? 'active' : ''}`}
          onClick={() => setActiveTab('patterns')}
        >
          <Layers size={14} />
          Patterns
        </button>

        <button
          className={`nav-tab ${activeTab === 'system-design' ? 'active' : ''}`}
          onClick={() => setActiveTab('system-design')}
        >
          <Server size={14} />
          System Design
        </button>

        <button
          className={`nav-tab ${activeTab === 'problems' ? 'active' : ''}`}
          onClick={() => setActiveTab('problems')}
        >
          <BookOpen size={14} />
          Curriculum
        </button>

        <button
          className={`nav-tab ${activeTab === 'matrix' ? 'active' : ''}`}
          onClick={() => setActiveTab('matrix')}
        >
          <BarChart2 size={14} />
          Tracks
        </button>
      </nav>

      {/* Right Controls: Track selector & Candidate Auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div className="user-track-pill" onClick={onOpenTrackModal} title="Switch track">
          <span className="track-dot"></span>
          <span>{trackLabels[currentTrack] || 'Track 2: Intermediate'}</span>
        </div>

        {currentUser ? (
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: 'var(--radius-pill)',
                padding: '4px 12px 4px 6px',
                cursor: 'pointer',
                color: '#ffffff',
                fontFamily: 'inherit',
                fontSize: '13px',
                fontWeight: 500,
                transition: 'all 0.2s ease'
              }}
              title="View account profile"
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getInitials(currentUser.name || 'Candidate')}
              </div>
              <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.name ? currentUser.name.split(' ')[0] : 'Candidate'}
              </span>
              <ChevronDown size={13} color="var(--text-muted)" />
            </button>

            {/* Apple Dropdown Profile Popover */}
            {isProfileOpen && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 110 }}
                  onClick={() => setIsProfileOpen(false)}
                />
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: '250px',
                  background: 'rgba(20, 20, 24, 0.96)',
                  backdropFilter: 'blur(32px)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '16px',
                  padding: '16px',
                  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.7)',
                  zIndex: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#ffffff' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                      {currentUser.email}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    <span>Active Track:</span>
                    <span style={{ color: 'var(--accent-blue)', fontWeight: 600, textTransform: 'capitalize' }}>
                      {currentUser.currentTrack || currentTrack}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setIsProfileOpen(false); onOpenTrackModal(); }}
                    className="btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '12.5px', padding: '7px 0' }}
                  >
                    Switch Track
                  </button>

                  <button
                    type="button"
                    onClick={() => { setIsProfileOpen(false); onLogout(); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      background: 'rgba(255, 69, 58, 0.12)',
                      border: '1px solid rgba(255, 69, 58, 0.3)',
                      color: 'var(--color-hard)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '8px 0',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="btn-primary"
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 600,
              gap: '6px'
            }}
          >
            <LogIn size={13} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
