import React from 'react';
import './CertaintyBar.css';

interface CertaintyBarProps {
  value: number;
  label?: string;
}

/**
 * Certainty percentage bar for identification results
 */
export const CertaintyBar: React.FC<CertaintyBarProps> = ({ value, label = 'Certainty' }) => {
  const percentage = Math.round(value * 100);
  const getColor = () => {
    if (percentage >= 75) return 'var(--color-success)';
    if (percentage >= 50) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  return (
    <div className="certainty-bar">
      <div className="certainty-bar__header">
        <span className="certainty-bar__label">{label}</span>
        <span className="certainty-bar__value" style={{ color: getColor() }}>
          {percentage}%
        </span>
      </div>
      <div className="certainty-bar__track">
        <div
          className="certainty-bar__fill"
          style={{ width: `${percentage}%`, background: getColor() }}
        />
      </div>
    </div>
  );
};