import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Button } from '../components/common/Button';
import './NameInputScreen.css';

/**
 * Player name input screen
 */
const NameInputScreen: React.FC = () => {
  const navigate = useNavigate();
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const existingName = useGameStore((s) => s.playerName);
  const [name, setName] = useState(existingName || '');
  const [error, setError] = useState('');

  const handleContinue = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    if (trimmed.length > 20) {
      setError('Name must be 20 characters or less');
      return;
    }
    setPlayerName(trimmed);
    navigate('/mode-select');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleContinue();
  };

  return (
    <div className="screen screen--centered name-screen">
      <div className="name-screen__content animate-fade-in-up">
        <h2 className="name-screen__title">Choose your name</h2>
        <p className="name-screen__subtitle">Used only inside this demo.</p>

        <div className="name-screen__input-wrapper">
          <input
            type="text"
            className="name-screen__input"
            placeholder="e.g., Niko"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            maxLength={20}
            autoFocus
            aria-label="Player name"
          />
          {error && <p className="name-screen__error">{error}</p>}
        </div>

        <div className="name-screen__actions">
          <Button onClick={handleContinue} disabled={name.trim().length < 2}>
            Continue
          </Button>
          <Button onClick={() => navigate('/')} variant="secondary">
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NameInputScreen;