import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glowing?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
}

/**
 * Card container component
 */
export const Card: React.FC<CardProps> = ({
  children, className = '', onClick, glowing = false, variant = 'default'
}) => {
  return (
    <div
      className={`card card--${variant} ${glowing ? 'card--glowing' : ''} ${onClick ? 'card--clickable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};