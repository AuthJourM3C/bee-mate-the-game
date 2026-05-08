import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import './HomeScreen.css';

/**
 * Home screen - BeeMate logo with mode selection and passcode entry
 */
const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="screen screen--centered home-screen">
      <div className="home-screen__logo animate-fade-in-down">
        <div className="home-screen__bee-icon">🐝</div>
        <h1 className="home-screen__title">BeeMate</h1>
        <p className="home-screen__subtitle">Pollution Hunter</p>
      </div>

      <div className="home-screen__welcome animate-fade-in">
        <p className="home-screen__greeting">Welcome, eco-warriors!</p>
        <p className="home-screen__description">
          Get ready to zoom around like a busy bee and discover where air pollution comes from. Let's work together to learn, explore, and make our planet a cleaner, happier place! 🌿💨
        </p>
      </div>

      <div className="home-screen__actions animate-fade-in-up">
        <Button
          onClick={() => navigate('/name')}
          variant="primary"
          size="lg"
          icon={<span>🎮</span>}
        >
          New Game
        </Button>

        <Button
          onClick={() => navigate('/passcode')}
          variant="secondary"
          size="lg"
          icon={<span>🔑</span>}
        >
          Resume Game
        </Button>
      </div>

      <p className="home-screen__footer animate-fade-in">
        A serious game for air pollution awareness
      </p>
    </div>
  );
};

export default HomeScreen;