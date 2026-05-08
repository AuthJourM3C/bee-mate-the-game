import React from 'react';
import { useToast } from '../../context/ToastContext';
import './Toast.css';

/**
 * Toast notification container
 */
export const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type} animate-fade-in-down`}
          onClick={() => removeToast(toast.id)}
          role="alert"
        >
          <span className="toast__icon">
            {toast.type === 'success' && '✅'}
            {toast.type === 'error' && '❌'}
            {toast.type === 'warning' && '⚠️'}
            {toast.type === 'info' && 'ℹ️'}
          </span>
          <span className="toast__message">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};