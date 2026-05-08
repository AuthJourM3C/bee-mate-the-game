import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { CharacterCard } from '../components/evolution/CharacterCard';
import { Button } from '../components/common/Button';
import './CharacterRevealScreen.css';

/**
 * Initial character card reveal screen
 */
const CharacterRevealScreen: React.FC = () => {
  const navigate = useNavigate();
  const character = useGameStore((s) => s.getCurrentCharacter());

  return (
    <div className="screen character-reveal">
      <div className="character-reveal__content animate-fade-in-up">
        <CharacterCard character={character} />

        <Button onClick={() => navigate('/dashboard')} size="lg">
          Ξεκίνα την αναζήτηση!
        </Button>
      </div>
    </div>
  );
};

export default CharacterRevealScreen;