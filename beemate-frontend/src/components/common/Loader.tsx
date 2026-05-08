import React from 'react';
import './Loader.css';

interface LoaderProps {
  message?: string;
  fact?: string;
}

/**
 * Animated bee loader for processing screens
 */
export const Loader: React.FC<LoaderProps> = ({ message = 'Analyzing...', fact }) => {
  return (
    <div className="loader">
      <div className="loader__bee animate-bee-fly">
        🐝
      </div>
      <div className="loader__waves">
        <span>~</span><span>~</span><span>~</span>
      </div>
      <p className="loader__message">{message}</p>
      {fact && (
        <div className="loader__fact animate-fade-in">
          <span className="loader__fact-icon">💡</span>
          <span className="loader__fact-label">Did you know?</span>
          <p className="loader__fact-text">{fact}</p>
        </div>
      )}
    </div>
  );
};