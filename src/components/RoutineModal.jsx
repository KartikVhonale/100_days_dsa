import React, { useState } from 'react';
import { X, Calendar, Plus, Trash2, ShieldCheck } from 'lucide-react';

export default function RoutineModal({ isOpen, onClose, user, onSaveRoutine }) {
  if (!isOpen) return null;

  const [activeDays, setActiveDays] = useState(user.activeDays || [0, 1, 2, 3, 4, 5, 6]);
  const [excludedDates, setExcludedDates] = useState(user.excludedDates || []);
  const [newDate, setNewDate] = useState('');

  const dayNames = [
    { num: 0, label: 'Sun', full: 'Sunday' },
    { num: 1, label: 'Mon', full: 'Monday' },
    { num: 2, label: 'Tue', full: 'Tuesday' },
    { num: 3, label: 'Wed', full: 'Wednesday' },
    { num: 4, label: 'Thu', full: 'Thursday' },
    { num: 5, label: 'Fri', full: 'Friday' },
    { num: 6, label: 'Sat', full: 'Saturday' }
  ];

  const toggleDay = (num) => {
    if (activeDays.includes(num)) {
      if (activeDays.length === 1) {
        alert('You must have at least one active study day per week!');
        return;
      }
      setActiveDays(activeDays.filter(d => d !== num));
    } else {
      setActiveDays([...activeDays, num].sort());
    }
  };

  const applyPreset = (preset) => {
    if (preset === 'all') setActiveDays([0, 1, 2, 3, 4, 5, 6]);
    if (preset === 'weekdays') setActiveDays([1, 2, 3, 4, 5]);
    if (preset === 'mon-sat') setActiveDays([1, 2, 3, 4, 5, 6]);
  };

  const addBlackoutDate = () => {
    if (!newDate) return;
    if (excludedDates.includes(newDate)) {
      alert('Date already excluded!');
      return;
    }
    setExcludedDates([...excludedDates, newDate].sort());
    setNewDate('');
  };

  const removeBlackoutDate = (d) => {
    setExcludedDates(excludedDates.filter(item => item !== d));
  };

  const handleSave = () => {
    onSaveRoutine({ activeDays, excludedDates });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <ShieldCheck size={18} color="var(--accent-blue)" />
              <h2 className="modal-title">Study Routine & Rest Days</h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Configure active days and blackout dates. Todait recalibrates daily targets across eligible days with zero overdue wall.
            </p>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Presets */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Quick Routine Presets
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-link"
              onClick={() => applyPreset('all')}
              style={{
                background: activeDays.length === 7 ? 'rgba(10, 132, 255, 0.16)' : undefined,
                color: activeDays.length === 7 ? '#fff' : undefined,
                borderColor: activeDays.length === 7 ? 'var(--accent-blue)' : undefined
              }}
            >
              Everyday (7 Days)
            </button>
            <button
              type="button"
              className="btn-link"
              onClick={() => applyPreset('weekdays')}
              style={{
                background: activeDays.length === 5 && !activeDays.includes(0) && !activeDays.includes(6) ? 'rgba(10, 132, 255, 0.16)' : undefined,
                color: activeDays.length === 5 && !activeDays.includes(0) && !activeDays.includes(6) ? '#fff' : undefined,
                borderColor: activeDays.length === 5 && !activeDays.includes(0) && !activeDays.includes(6) ? 'var(--accent-blue)' : undefined
              }}
            >
              Mon – Fri (Weekdays Only)
            </button>
            <button
              type="button"
              className="btn-link"
              onClick={() => applyPreset('mon-sat')}
              style={{
                background: activeDays.length === 6 && !activeDays.includes(0) ? 'rgba(10, 132, 255, 0.16)' : undefined,
                color: activeDays.length === 6 && !activeDays.includes(0) ? '#fff' : undefined,
                borderColor: activeDays.length === 6 && !activeDays.includes(0) ? 'var(--accent-blue)' : undefined
              }}
            >
              Mon – Sat (Rest on Sunday)
            </button>
          </div>
        </div>

        {/* Days of Week Selection */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Active Days ({activeDays.length} days/week active)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
            {dayNames.map(({ num, label, full }) => {
              const isActive = activeDays.includes(num);
              return (
                <div
                  key={num}
                  onClick={() => toggleDay(num)}
                  style={{
                    background: isActive ? 'rgba(10, 132, 255, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1.5px solid ${isActive ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                    borderRadius: '12px',
                    padding: '12px 6px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all var(--duration-quick) var(--ease-apple)',
                    userSelect: 'none'
                  }}
                  title={full}
                >
                  <div style={{ fontWeight: 700, fontSize: '14px', color: isActive ? '#fff' : 'var(--text-dim)' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '10.5px', color: isActive ? 'var(--accent-blue)' : 'var(--text-dim)', marginTop: '2px', fontWeight: 600 }}>
                    {isActive ? 'Active' : 'Off'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Blackout / Holiday Dates */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Blackout & Holiday Dates ({excludedDates.length} skipped)
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="input-field"
              style={{ flex: 1, borderRadius: 'var(--radius-pill)', padding: '8px 16px' }}
            />
            <button
              type="button"
              className="btn-primary"
              onClick={addBlackoutDate}
              style={{ padding: '0 18px' }}
            >
              <Plus size={15} /> Add Date
            </button>
          </div>

          {excludedDates.length === 0 ? (
            <div style={{ fontSize: '12.5px', color: 'var(--text-dim)' }}>
              No blackout dates added. Workload distributes smoothly across all selected active days.
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {excludedDates.map((dateStr) => (
                <div
                  key={dateStr}
                  style={{
                    background: 'rgba(255, 69, 58, 0.1)',
                    border: '1px solid rgba(255, 69, 58, 0.25)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '4px 12px',
                    fontSize: '12px',
                    color: 'var(--color-hard)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Calendar size={12} />
                  <span>{dateStr}</span>
                  <button
                    type="button"
                    onClick={() => removeBlackoutDate(dateStr)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--color-hard)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn-link" onClick={onClose} style={{ padding: '8px 18px' }}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={handleSave}>
            Recalculate Plan
          </button>
        </div>
      </div>
    </div>
  );
}
