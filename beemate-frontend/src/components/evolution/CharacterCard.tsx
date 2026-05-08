import React from 'react';
import type { Character } from '../../types';
import { StatBar } from '../common/StatBar';
import './CharacterCard.css';

interface CharacterCardProps {
  character: Character;
  animated?: boolean;
}

/**
 * Simplified character card for children — with 3 key stats
 */
export const CharacterCard: React.FC<CharacterCardProps> = ({
  character, animated = true
}) => {
  // Pick exactly 3 stats to keep it simple for kids
  const statEntries = Object.entries(character.stats).slice(0, 3);
  const labelEntries = Object.entries(character.statLabels).slice(0, 3);
  const icons = ['🔍', '⚡', '💪'];

  return (
    <div className={`char-card ${animated ? 'animate-fade-in-scale' : ''}`}>
      <div className="char-card__avatar-frame animate-power-up-glow">
        <div className="char-card__avatar">
          <img
            src={character.avatarUrl}
            alt={character.name}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="char-card__avatar-emoji">🐝</span>`;
            }}
          />
        </div>
      </div>

      <h3 className="char-card__name">{character.name}</h3>
      <span className="char-card__title">{character.title}</span>

      <p className="char-card__description">{character.description}</p>

      <div className="char-card__stats">
        {statEntries.map(([key, value], idx) => (
          <StatBar
            key={key}
            label={labelEntries[idx]?.[1] || key}
            value={value}
            icon={icons[idx]}
          />
        ))}
      </div>

      <p className="char-card__flavor">{character.flavorText}</p>
    </div>
  );
};