import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import './ModeSelectScreen.css';

/**
 * Mode selection screen - Explorer (active) / Reporter (disabled)
 */
const ModeSelectScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="screen screen--centered mode-screen">
      <div className="mode-screen__content animate-fade-in-up">
        <h2 className="mode-screen__title">Choose a mode</h2>
        <p className="mode-screen__subtitle">Explorer is available in this demo.</p>

        <div className="mode-screen__options">
          <button className="mode-option mode-option--active" onClick={() => navigate('/explorer-welcome')}>
            <span className="mode-option__icon">🧭</span>
            <div className="mode-option__text">
              <span className="mode-option__name">Explorer Mode</span>
              <span className="mode-option__desc">Collect signals with audio/photos.</span>
            </div>
          </button>

          <button className="mode-option mode-option--disabled" disabled>
            <span className="mode-option__icon">📋</span>
            <div className="mode-option__text">
              <span className="mode-option__name">Reporter Mode</span>
              <span className="mode-option__desc">Disabled in this demo.</span>
            </div>
          </button>
        </div>

        <Button onClick={() => navigate('/name')} variant="secondary">
          Back
        </Button>
      </div>
    </div>
  );
};

export default ModeSelectScreen;