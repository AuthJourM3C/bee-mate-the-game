import React from 'react';
import './QualityStars.css';

interface QualityStarsProps {
  score: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

/**
 * Quality score displayed as stars
 */
export const QualityStars: React.FC<QualityStarsProps> = ({
  score, maxScore = 5, size = 'md', showLabel = true
}) => {
  return (
    <div className={`quality-stars quality-stars--${size}`}>
      {showLabel && <span className="quality-stars__label">Quality:</span>}
      <div className="quality-stars__stars" aria-label={`Quality ${score} out of ${maxScore}`}>
        {Array.from({ length: maxScore }, (_, i) => (
          <span
            key={i}
            className={`quality-stars__star ${i < score ? 'quality-stars__star--filled' : ''}`}
          >
            ⭐
          </span>
        ))}
      </div>
      {showLabel && (
        <span className="quality-stars__text">({score}/{maxScore})</span>
      )}
    </div>
  );
};