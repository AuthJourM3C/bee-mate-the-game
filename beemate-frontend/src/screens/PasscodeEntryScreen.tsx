import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { restorePasscode } from '../services/passcodeService';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import './PasscodeEntryScreen.css';

/**
 * Passcode entry screen for restoring game progress
 */
const PasscodeEntryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const restoreState = useGameStore((s) => s.restoreState);
  const completeOnboarding = useGameStore((s) => s.completeOnboarding);
  const [passcode, setPasscode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRestore = async () => {
    const trimmed = passcode.trim();
    if (!trimmed) {
      setError('Please enter a passcode');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const state = await restorePasscode(trimmed);
      restoreState(state);
      completeOnboarding();
      showToast(`Welcome back, ${state.playerName}!`, 'success');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Invalid passcode. Please check and try again.';
      setError(msg);
      showToast('Invalid passcode', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRestore();
  };

  return (
    <div className="screen screen--centered passcode-screen">
      <div className="passcode-screen__content animate-fade-in-up">
        <div className="passcode-screen__header">
          <span className="passcode-screen__icon">🐝</span>
          <h2 className="passcode-screen__title">Welcome back!</h2>
          <p className="passcode-screen__subtitle">Enter your passcode to restore progress:</p>
        </div>

        <div className="passcode-screen__input-wrapper">
          <input
            type="text"
            className="passcode-screen__input"
            placeholder="XXXX-XXXX-XXXX"
            value={passcode}
            onChange={(e) => { setPasscode(e.target.value.toUpperCase()); setError(''); }}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-label="Passcode"
          />
          {error && <p className="passcode-screen__error">⚠️ {error}</p>}
        </div>

        <div className="passcode-screen__actions">
          <Button onClick={handleRestore} loading={isLoading} disabled={!passcode.trim()}>
            Restore game
          </Button>
          <Button onClick={() => navigate('/')} variant="secondary">
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasscodeEntryScreen;