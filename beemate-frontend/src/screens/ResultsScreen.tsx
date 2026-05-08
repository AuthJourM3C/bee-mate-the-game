import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useToast } from '../context/ToastContext';
import { generatePasscode } from '../services/passcodeService';
import { getCharacter } from '../config/evolutionTree';
import { POINTS } from '../config/points';
import { POLLUTION_TAGS } from '../config/pollutionTags';
import { QualityStars } from '../components/common/QualityStars';
import { CertaintyBar } from '../components/common/CertaintyBar';
import { LocationMap } from '../components/map/LocationMap';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import type { Contribution, UserFeedback } from '../types';
import './ResultsScreen.css';

/**
 * Results screen - shows R/NR classification, quality, certainty, points, map
 * Handles confirm/reject flow and evolution checking
 */
const ResultsScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const {
    setContributionFeedback, checkEvolution, evolveCharacter,
    setPasscode, playerName, level, characterId, totalPoints,
    audioPoints, imagePoints, audioCount, imageCount, evolutionPath,
    getCurrentCharacter
  } = useGameStore();

  const contribution = (location.state as any)?.contribution as Contribution;

  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState<'no_source' | 'wrong_id' | 'more_sources' | ''>('');
  const [correctedSource, setCorrectedSource] = useState('');
  const [additionalNote, setAdditionalNote] = useState('');
  const [evolutionData, setEvolutionData] = useState<{ shouldEvolve: boolean; nextCharacterId: string | null } | null>(null);
  const [generatedPasscode, setGeneratedPasscode] = useState('');

  useEffect(() => {
    if (!contribution) {
      navigate('/dashboard');
    }
  }, [contribution, navigate]);

  if (!contribution) return null;

  const isRelated = contribution.classification === 'R';
  const sourceLabel = contribution.sources?.[0]?.label || 'Unknown';
  const sourceIcon = POLLUTION_TAGS.find(t => t.id === contribution.sources?.[0]?.id)?.icon || '🔍';

  const handleConfirm = async () => {
    const feedback: UserFeedback = {
      action: 'confirm',
      feedbackPoints: POINTS.CONFIRM_BONUS
    };
    setContributionFeedback(contribution.id, feedback);
    showToast(`+${POINTS.CONFIRM_BONUS} point for confirmation!`, 'success');

    await checkForEvolution();
  };

  const handleRejectClick = () => {
    setShowRejectConfirm(true);
  };

  const handleRejectConfirmed = () => {
    setShowRejectConfirm(false);
    setShowRejectForm(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason) return;

    const feedbackPoints = rejectReason === 'no_source'
      ? POINTS.REJECT_NO_SOURCE
      : POINTS.CORRECTION_BONUS;

    const feedback: UserFeedback = {
      action: 'reject',
      rejectReason: rejectReason as any,
      correctedSource: correctedSource || undefined,
      additionalNote: additionalNote || undefined,
      feedbackPoints
    };

    setContributionFeedback(contribution.id, feedback);

    if (feedbackPoints > 0) {
      showToast(`+${feedbackPoints} points for your correction!`, 'success');
    } else {
      showToast('Feedback recorded. Thank you!', 'info');
    }

    setShowRejectForm(false);
    await checkForEvolution();
  };

  const checkForEvolution = async () => {
    const evolution = checkEvolution();
    if (evolution.shouldEvolve && evolution.nextCharacterId) {
      try {
        const pc = await generatePasscode({
          playerName, level: level + 1,
          characterId: evolution.nextCharacterId,
          totalPoints, audioPoints, imagePoints,
          audioCount, imageCount, evolutionPath
        });
        setGeneratedPasscode(pc);
        setPasscode(pc);
      } catch {
        setGeneratedPasscode('');
      }
      evolveCharacter(evolution.nextCharacterId);
      setEvolutionData(evolution);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (evolutionData?.shouldEvolve && evolutionData.nextCharacterId) {
    const prevChar = getCharacter(characterId);
    const newChar = getCharacter(evolutionData.nextCharacterId);
    navigate('/evolution', {
      state: {
        previousCharacterId: prevChar.id === evolutionData.nextCharacterId ? 'pollini' : prevChar.id,
        newCharacterId: evolutionData.nextCharacterId,
        passcode: generatedPasscode
      }
    });
    return null;
  }

  return (
    <div className="screen results-screen">
      <div className="results-screen__content animate-fade-in-up">
        {/* Header */}
        <div className="results-screen__header">
          {isRelated ? (
            <>
              <span className="results-screen__check">✅</span>
              <h2 className="results-screen__title">Congratulations!</h2>
              <p className="results-screen__subtitle">
                You {contribution.mediaType === 'image' ? 'took a photo of' : 'recorded'} a pollution source.
              </p>
            </>
          ) : (
            <>
              <span className="results-screen__check">🔍</span>
              <h2 className="results-screen__title">Analysis complete</h2>
              <p className="results-screen__subtitle">
                No pollution source was detected in this {contribution.mediaType === 'image' ? 'image' : 'recording'}.
              </p>
            </>
          )}
        </div>

        {/* Quality */}
        <QualityStars score={contribution.qualityScore} />

        {/* Source (if R) */}
        {isRelated && contribution.sources.length > 0 && (
          <div className="results-screen__source">
            <span className="results-screen__source-label">Source detected:</span>
            <span className="results-screen__source-value">
              {sourceIcon} {sourceLabel}
            </span>
            <CertaintyBar value={contribution.confidence} />
          </div>
        )}

        {/* Points */}
        <div className="results-screen__points">
          <span className="results-screen__points-label">Points earned:</span>
          {contribution.points.breakdown.map((item, i) => (
            <div key={i} className="results-screen__point-row">
              <span>+{item.points} 🍯</span>
              <span className="text-muted">{item.reason}</span>
            </div>
          ))}
          <div className="results-screen__point-total">
            <span>Total: +{contribution.points.total} 🍯</span>
          </div>
        </div>

        {/* Map */}
        {contribution.location && (
          <div className="results-screen__map">
            <span className="results-screen__map-label">📍 Location:</span>
            <LocationMap
              location={contribution.location}
              label={`${contribution.mediaType === 'image' ? 'Photo' : 'Audio'} pollution source found here`}
            />
          </div>
        )}

        {/* NR Tip */}
        {!isRelated && (
          <div className="results-screen__tip">
            <span className="results-screen__tip-icon">💡</span>
            <p>Tip: Try capturing near busy roads, construction sites, or waste bins!</p>
          </div>
        )}

        {/* Actions */}
        {isRelated ? (
          <div className="results-screen__actions">
            <p className="results-screen__confirm-label">Is this correct?</p>
            <div className="results-screen__action-row">
              <Button onClick={handleConfirm} variant="success">✅ Confirm</Button>
              <Button onClick={handleRejectClick} variant="danger">❌ Reject</Button>
            </div>
          </div>
        ) : (
          <Button onClick={handleGoToDashboard} size="lg">OK → Back to hub</Button>
        )}
      </div>

      {/* Reject Confirmation Modal */}
      <Modal isOpen={showRejectConfirm} onClose={() => setShowRejectConfirm(false)} title="Reject results?">
        <p className="text-secondary">Are you sure you want to reject this identification?</p>
        <div className="flex flex-col gap-sm">
          <Button onClick={handleRejectConfirmed}>Yes, reject</Button>
          <Button onClick={() => setShowRejectConfirm(false)} variant="secondary">No, go back</Button>
        </div>
      </Modal>

      {/* Rejection Reason Modal */}
      <Modal isOpen={showRejectForm} onClose={() => setShowRejectForm(false)} title="Why is it wrong?">
        <div className="results-screen__reject-form">
          <label className="results-screen__radio-group">
            <input type="radio" name="reason" value="no_source"
              checked={rejectReason === 'no_source'}
              onChange={() => setRejectReason('no_source')}
            />
            <span>No pollution source exists</span>
          </label>
          <label className="results-screen__radio-group">
            <input type="radio" name="reason" value="wrong_id"
              checked={rejectReason === 'wrong_id'}
              onChange={() => setRejectReason('wrong_id')}
            />
            <span>Wrongly identified source</span>
          </label>
          <label className="results-screen__radio-group">
            <input type="radio" name="reason" value="more_sources"
              checked={rejectReason === 'more_sources'}
              onChange={() => setRejectReason('more_sources')}
            />
            <span>There are more sources</span>
          </label>

          {(rejectReason === 'wrong_id' || rejectReason === 'more_sources') && (
            <>
              <select
                className="capture-screen__select"
                value={correctedSource}
                onChange={(e) => setCorrectedSource(e.target.value)}
              >
                <option value="">Select correct source...</option>
                {POLLUTION_TAGS.map((tag) => (
                  <option key={tag.id} value={tag.id}>{tag.icon} {tag.label}</option>
                ))}
              </select>
              <textarea
                className="capture-screen__textarea"
                placeholder="Additional notes (optional)"
                value={additionalNote}
                onChange={(e) => setAdditionalNote(e.target.value)}
                rows={2}
              />
            </>
          )}

          <Button onClick={handleRejectSubmit} disabled={!rejectReason}>Submit feedback</Button>
        </div>
      </Modal>
    </div>
  );
};

export default ResultsScreen;