import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Button } from '../components/common/Button';
import './ExplorerWelcomeScreen.css';

/**
 * Explorer mode welcome screen with bee character
 */
const ExplorerWelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const character = useGameStore((s) => s.getCurrentCharacter());
  const completeOnboarding = useGameStore((s) => s.completeOnboarding);

  const handleContinue = () => {
    completeOnboarding();
    navigate('/character-reveal');
  };

  return (
    <div className="screen screen--centered explorer-welcome">
      <div className="explorer-welcome__content animate-fade-in-scale" onClick={handleContinue}>
        <div className="explorer-welcome__avatar-frame">
          <img
            src={character.avatarUrl}
            alt={character.name}
            className="explorer-welcome__avatar"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.innerHTML = '<span style="font-size:64px">🐝</span>';
            }}
          />
        </div>

        <h2 className="explorer-welcome__title">Explorer Mode</h2>
        <p className="explorer-description__text">Welcome to the Explorer mode.</p>
        <p className="explorer-description__text">Explore the world around you and discover where air pollution comes from.</p>
        <p className="explorer-welcome__tap">Tap anywhere to continue →</p>
      </div>

      <Button
        onClick={() => navigate('/mode-select')}
        variant="secondary"
        size="lg"
      >
        Back
      </Button>
    </div>
  );
};

export default ExplorerWelcomeScreen;