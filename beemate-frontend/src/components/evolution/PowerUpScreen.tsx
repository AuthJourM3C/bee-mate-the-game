import React, { useState } from 'react';
import type { Character } from '../../types';
import { CharacterCard } from './CharacterCard';
import { Button } from '../common/Button';
import './PowerUpScreen.css';

interface PowerUpScreenProps {
  previousCharacter: Character;
  newCharacter: Character;
  passcode?: string;
  onComplete: () => void;
}

/**
 * Multi-step Power Up evolution sequence
 * Step 1: "Power Up!" with current avatar + flavor text
 * Step 2: "Power Up!" with new avatar + evolution message
 * Step 3: New character card with passcode
 */
export const PowerUpScreen: React.FC<PowerUpScreenProps> = ({
  previousCharacter, newCharacter, passcode, onComplete
}) => {
  const [step, setStep] = useState(1);

  const handleTap = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  return (
    <div className="power-up-screen screen screen--centered">
      {step === 1 && (
        <div className="power-up__step animate-fade-in-scale" onClick={handleTap}>
          <div className="power-up__avatar-frame animate-power-up-glow">
            <img
              src={previousCharacter.avatarUrl}
              alt={previousCharacter.name}
              className="power-up__avatar-img"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML = '<span style="font-size:64px">🐝</span>';
              }}
            />
          </div>
          <h2 className="power-up__title">Power Up!</h2>
          <p className="power-up__message">
            {newCharacter.powerUpMessages[0] || `${previousCharacter.name} is evolving...`}
          </p>
          <p className="power-up__tap">Tap anywhere to continue →</p>
        </div>
      )}

      {step === 2 && (
        <div className="power-up__step animate-fade-in-scale" onClick={handleTap}>
          <div className="power-up__avatar-frame power-up__avatar-frame--new animate-power-up-glow">
            <img
              src={newCharacter.avatarUrl}
              alt={newCharacter.name}
              className="power-up__avatar-img"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML = '<span style="font-size:64px">🐝</span>';
              }}
            />
          </div>
          <h2 className="power-up__title">Power Up!</h2>
          <p className="power-up__message">
            {newCharacter.powerUpMessages[1] || `${previousCharacter.name} has powered up into ${newCharacter.name}!!!`}
          </p>
          <p className="power-up__tap">Tap anywhere to continue →</p>
        </div>
      )}

      {step === 3 && (
        <div className="power-up__step power-up__step--card animate-fade-in-up">
          <div className="power-up__card-header">
            <h3 className="power-up__card-name">{newCharacter.name}</h3>
            <p className="power-up__card-path">{newCharacter.tier} unlocked.</p>
          </div>

          <CharacterCard character={newCharacter} />

          {passcode && (
            <div className="power-up__passcode">
              <p className="power-up__passcode-label">Your save passcode:</p>
              <div className="power-up__passcode-code">{passcode}</div>
              <p className="power-up__passcode-hint">
                Write this down! Use it to restore your progress.
              </p>
            </div>
          )}

          <Button onClick={onComplete} variant="primary" size="lg">
            Play again
          </Button>
        </div>
      )}
    </div>
  );
};