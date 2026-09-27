import React, { useState } from 'react';
import { RotateCcw, Check, Star } from 'lucide-react';
import { api } from '../api/client';

export default function SpacedRepetition({ memoryReview, onReviewCompleted }) {
  const [retention, setRetention] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If no memory review is due, keep UI clean and invisible
  if (!memoryReview) return null;

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await api.updateSpacedReview(memoryReview.id || memoryReview._id, 'completed', retention);
      if (onReviewCompleted) onReviewCompleted();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 159, 10, 0.06)',
      border: '1px solid rgba(255, 159, 10, 0.25)',
      borderRadius: 'var(--radius-card)',
      padding: '14px 20px',
      marginBottom: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <RotateCcw size={15} color="var(--color-medium)" />
        <div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-medium)', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '8px' }}>
            7-Day Review
          </span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
            #{memoryReview.problemId}: {memoryReview.problemTitle}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '3px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={13}
              onClick={() => setRetention(star)}
              style={{
                cursor: 'pointer',
                fill: star <= retention ? '#ff9f0a' : 'transparent',
                color: star <= retention ? '#ff9f0a' : 'var(--text-dim)'
              }}
            />
          ))}
        </div>

        <button
          className="btn-primary"
          style={{ background: '#ff9f0a', color: '#000', fontSize: '11.5px', padding: '4px 10px' }}
          onClick={handleComplete}
          disabled={isSubmitting}
        >
          <Check size={13} />
          Passed
        </button>
      </div>
    </div>
  );
}
