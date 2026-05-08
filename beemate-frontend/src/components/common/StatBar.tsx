import React from 'react';
import './StatBar.css';

interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  icon?: string;
}

/**
 * Character card stat bar
 */
export const StatBar: React.FC<StatBarProps> = ({
  label, value, maxValue = 100, icon
}) => {
  const percentage = Math.min(100, (value / maxValue) * 100);

  return (
    <div className="stat-bar">
      <div className="stat-bar__header">
        {icon && <span className="stat-bar__icon">{icon}</span>}
        <span className="stat-bar__label">{label}</span>
        <span className="stat-bar__value">{value}<span className="stat-bar__max">/{maxValue}</span></span>
      </div>
      <div className="stat-bar__track">
        <div className="stat-bar__fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};