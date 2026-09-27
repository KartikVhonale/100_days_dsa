import React, { useState } from 'react';
import { Lock, ShieldCheck, User, Mail, Eye, EyeOff, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('intermediate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const tracks = [
    { id: 'beginner', label: 'Beginner', desc: 'Non-CS / Foundations' },
    { id: 'intermediate', label: 'Intermediate', desc: '0–2 YOE / Mediums' },
    { id: 'advanced', label: 'Advanced', desc: '3–6 YOE / L4-L5' },
    { id: 'elite', label: 'Elite', desc: 'Staff / CP / Hards' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login({ email, password });
        if (res && res.user) {
          onAuthSuccess(res.user);
          onClose();
        }
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your candidate name.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        const res = await api.register({
          name: name.trim(),
          email: email.trim(),
          password,
          currentTrack
        });
        if (res && res.user) {
          onAuthSuccess(res.user);
          onClose();
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          background: 'rgba(18, 18, 22, 0.95)',
          backdropFilter: 'blur(32px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: '30px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Lock size={14} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
                {mode === 'login' ? 'Candidate Sign In' : 'Create Prep Account'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Track personal FAANG progress & spaced repetition
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            title="Close"
            style={{ width: '28px', height: '28px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Segmented Control */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'rgba(255, 255, 255, 0.06)',
          padding: '3px',
          borderRadius: 'var(--radius-pill)',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            style={{
              background: mode === 'login' ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
              color: mode === 'login' ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '7px 0',
              fontSize: '13.5px',
              fontWeight: mode === 'login' ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            style={{
              background: mode === 'register' ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
              color: mode === 'register' ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '7px 0',
              fontSize: '13.5px',
              fontWeight: mode === 'register' ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <div style={{
            background: 'rgba(255, 69, 58, 0.12)',
            border: '1px solid rgba(255, 69, 58, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            fontSize: '13px',
            color: 'var(--color-hard)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '36px' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '36px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Password {mode === 'register' && <span style={{ fontWeight: 400, color: 'var(--text-dim)' }}>(min. 6 characters)</span>}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '36px', paddingRight: '36px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '9px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '3px'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                Select Your Preparation Track
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {tracks.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setCurrentTrack(t.id)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: currentTrack === t.id ? 'rgba(41, 151, 255, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                      border: currentTrack === t.id ? '1.5px solid var(--accent-blue)' : '1px solid var(--border-color)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit'
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 600, color: currentTrack === t.id ? '#ffffff' : 'var(--text-body)' }}>
                      {t.label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {t.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '11px 0',
              marginTop: '8px',
              fontSize: '14.5px',
              fontWeight: 600
            }}
          >
            {loading ? 'Authenticating...' : (mode === 'login' ? 'Sign In to FAANG 100' : 'Start Preparation Journey')}
          </button>
        </form>

        {/* Security Footnote */}
        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11.5px',
          color: 'var(--text-dim)',
          lineHeight: 1.4
        }}>
          <ShieldCheck size={16} color="var(--color-easy)" style={{ flexShrink: 0 }} />
          <span>
            Passwords salt-hashed with bcrypt. Session tokens signed with 256-bit JWT. Progress is strictly isolated per candidate account.
          </span>
        </div>
      </div>
    </div>
  );
}
