import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  showFraction?: boolean;
  variant?: 'default' | 'audio' | 'image' | 'balanced';
  animated?: boolean;
  size?: 'sm' | 'md';
}

/**
 * Animated progress bar component
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  current, max, label, showFraction = true,
  variant = 'default', animated = true, size = 'md'
}) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));

  return (
    <div className={`progress-bar progress-bar--${size}`}>
      {(label || showFraction) && (
        <div className="progress-bar__header">
          {label && <span className="progress-bar__label">{label}</span>}
          {showFraction && (
            <span className="progress-bar__fraction">{current}/{max}</span>
          )}
        </div>
      )}
      <div className="progress-bar__track">
        <div
          className={`progress-bar__fill progress-bar__fill--${variant} ${animated ? 'progress-bar__fill--animated' : ''}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};