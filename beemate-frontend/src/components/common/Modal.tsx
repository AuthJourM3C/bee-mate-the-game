import React, { useEffect, useCallback } from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  title?: string;
  showClose?: boolean;
}

/**
 * Full-screen modal overlay
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen, onClose, children, title, showClose = false
}) => {
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && onClose) onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in" role="dialog" aria-modal="true">
      <div className="modal-content animate-fade-in-scale">
        {(title || showClose) && (
          <div className="modal-header">
            {title && <h2 className="modal-title">{title}</h2>}
            {showClose && onClose && (
              <button className="modal-close" onClick={onClose} aria-label="Close">
                ✕
              </button>
            )}
          </div>
        )}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};