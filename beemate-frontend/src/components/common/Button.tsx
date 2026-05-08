import React from 'react';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  type?: 'button' | 'submit';
  className?: string;
}

/**
 * Reusable button component with dark theme styling
 */
export const Button: React.FC<ButtonProps> = ({
  children, onClick, variant = 'primary', size = 'md',
  fullWidth = true, disabled = false, loading = false,
  icon, type = 'button', className = ''
}) => {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      {icon && !loading && <span className="btn__icon">{icon}</span>}
      <span className="btn__text">{children}</span>
    </button>
  );
};