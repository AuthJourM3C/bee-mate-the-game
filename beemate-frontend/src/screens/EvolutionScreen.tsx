import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCharacter } from '../config/evolutionTree';
import { PowerUpScreen } from '../components/evolution/PowerUpScreen';

/**
 * Evolution screen - shows the Power Up sequence
 */
const EvolutionScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;

  const previousCharacterId = state?.previousCharacterId || 'pollini';
  const newCharacterId = state?.newCharacterId || 'pollini';
  const passcode = state?.passcode || '';

  const previousCharacter = getCharacter(previousCharacterId);
  const newCharacter = getCharacter(newCharacterId);

  const handleComplete = () => {
    navigate('/dashboard');
  };

  return (
    <PowerUpScreen
      previousCharacter={previousCharacter}
      newCharacter={newCharacter}
      passcode={passcode}
      onComplete={handleComplete}
    />
  );
};

export default EvolutionScreen;