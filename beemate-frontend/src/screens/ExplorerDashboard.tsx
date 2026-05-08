import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { ProgressBar } from '../components/common/ProgressBar';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import './ExplorerDashboard.css';

/**
 * Main explorer dashboard - hub screen
 */
const ExplorerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    playerName, totalPoints, audioPoints, imagePoints,
    audioCount, imageCount, characterId, resetGame,
    getCurrentCharacter, getCurrentThreshold, calculatePath
  } = useGameStore();

  const character = getCurrentCharacter();
  const threshold = getCurrentThreshold();
  const path = calculatePath();
  const [showResetModal, setShowResetModal] = useState(false);

  const handleReset = () => {
    resetGame();
    showToast('Progress reset', 'info');
    navigate('/');
  };

  const getPathLabel = () => {
    if (path === 'audio') return '🎤 Audio Path';
    if (path === 'image') return '📷 Image Path';
    if (path === 'balanced') return '⚖️ Balanced Path';
    return '';
  };

  return (
    <div className="screen dashboard">
      {/* Player Header */}
      <div className="dashboard__header animate-fade-in-down">
        <div className="dashboard__player">
          <div className="dashboard__avatar-frame">
            <img
              src={character.avatarUrl}
              alt={character.name}
              className="dashboard__avatar"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML = '<span style="font-size:28px">🐝</span>';
              }}
            />
          </div>
          <div className="dashboard__player-info">
            <span className="dashboard__player-name">{playerName}</span>
            <span className="dashboard__player-role">Explorer • {character.name}</span>
          </div>
        </div>
        <button className="dashboard__reset-btn" onClick={() => setShowResetModal(true)}>
          Reset
        </button>
      </div>

      {/* Points Section */}
      <div className="dashboard__points animate-fade-in-up">
        <ProgressBar
          current={totalPoints}
          max={threshold}
          label="Progress"
          variant="default"
        />

        <div className="dashboard__breakdown">
          <div className="dashboard__breakdown-row">
            <span className="dashboard__breakdown-label">🎤 Audio: {audioPoints} pts</span>
            <div className="dashboard__mini-bar">
              <div
                className="dashboard__mini-fill dashboard__mini-fill--audio"
                style={{ width: `${totalPoints > 0 ? (audioPoints / totalPoints) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="dashboard__breakdown-row">
            <span className="dashboard__breakdown-label">📷 Image: {imagePoints} pts</span>
            <div className="dashboard__mini-bar">
              <div
                className="dashboard__mini-fill dashboard__mini-fill--image"
                style={{ width: `${totalPoints > 0 ? (imagePoints / totalPoints) * 100 : 0}%` }}
              />
            </div>
          </div>
          {path !== 'none' && (
            <span className="dashboard__path-trend">Path trend: {getPathLabel()}</span>
          )}
        </div>

        <div className="dashboard__counters">
          <span>🎤 Audio: {audioCount}</span>
          <span>•</span>
          <span>📷 Photos: {imageCount}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="dashboard__actions animate-fade-in-up">
        <Button
          onClick={() => navigate('/capture/photo')}
          variant="primary"
          size="lg"
          icon={<span>📷</span>}
        >
          Take a photo
        </Button>

        <Button
          onClick={() => navigate('/capture/audio')}
          variant="primary"
          size="lg"
          icon={<span>🎤</span>}
        >
          Make a recording
        </Button>

        <Button
          onClick={() => navigate('/my-map')}
          variant="primary"
          size="lg"
          icon={<span>🗺️</span>}
        >
          View my map
        </Button>

        <Button
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*,audio/*';
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              const file = target.files?.[0];
              if (!file) return;

              if (file.type.startsWith('image/')) {
                navigate('/capture/photo', { state: { preSelectedFile: file } });
              } else if (file.type.startsWith('audio/')) {
                navigate('/capture/audio', { state: { preSelectedFile: file } });
              } else {
                showToast('Unsupported file type', 'error');
              }
            };
            input.click();
          }}
          variant="secondary"
          size="lg"
          icon={<span>📁</span>}
        >
          Browse files
        </Button>

        <Button
          onClick={() => navigate('/mode-select')}
          variant="secondary"
        >
          Back to mode select
        </Button>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal isOpen={showResetModal} onClose={() => setShowResetModal(false)} title="Reset Progress">
        <p className="text-secondary">Are you sure? All progress will be lost.</p>
        <div className="flex flex-col gap-sm">
          <Button onClick={handleReset} variant="danger">Yes, reset everything</Button>
          <Button onClick={() => setShowResetModal(false)} variant="secondary">Cancel</Button>
        </div>
      </Modal>
    </div>
  );
};

export default ExplorerDashboard;