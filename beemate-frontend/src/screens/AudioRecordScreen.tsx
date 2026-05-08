import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useGeolocation } from '../hooks/useGeolocation';
import { useGameStore } from '../store/gameStore';
import { useToast } from '../context/ToastContext';
import { identifyAudio } from '../services/identifyService';
import { POLLUTION_TAGS } from '../config/pollutionTags';
import { getRandomFact } from '../config/pollutionFacts';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { Loader } from '../components/common/Loader';
import { LocationPickerMap } from '../components/common/LocationPickerMap';
import type { GeoLocation } from '../types';
import './CaptureScreen.css';

/**
 * Audio recording screen - record → preview → context tagging → submit → processing
 */
const AudioRecordScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const {
    isRecording, recordingTime, wavBlob, wavUrl, audioUrl,
    error: micError, permissionGranted,
    requestPermission, startRecording, stopRecording, clearRecording,
    setPreSelectedFile
  } = useAudioRecorder();
  const { getCurrentLocation } = useGeolocation();
  const addContribution = useGameStore((s) => s.addContribution);

  const [step, setStep] = useState<'record' | 'preview' | 'tagging' | 'processing'>('record');
  const [contextType, setContextType] = useState('');
  const [description, setDescription] = useState('');
  const [processingFact, setProcessingFact] = useState('');
  const [captureLocation, setCaptureLocation] = useState<GeoLocation | null>(null);

  // Check for pre-selected file from dashboard
  React.useEffect(() => {
    const preSelectedFile = location.state?.preSelectedFile as File | undefined;
    if (preSelectedFile && step === 'record') {
      window.history.replaceState({}, document.title); // clear state avoiding loop
      setPreSelectedFile(preSelectedFile).then(() => {
        setStep('preview');
      }).catch(console.error);
    }
  }, [location.state, step, setPreSelectedFile]);

  // React effect to get location when entering tagging step
  React.useEffect(() => {
    if (step === 'tagging' && !captureLocation) {
      getCurrentLocation().then(loc => setCaptureLocation(loc)).catch(console.error);
    }
  }, [step, captureLocation, getCurrentLocation]);

  const handleSubmit = async () => {
    if (!wavBlob) return;
    setProcessingFact(getRandomFact());
    setStep('processing');

    try {
      const result = await identifyAudio(
        wavBlob,
        contextType || undefined,
        description || undefined
      );

      const finalLocation = captureLocation || await getCurrentLocation();

      const contribution = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        mediaType: 'audio' as const,
        classification: result.classification,
        qualityScore: result.qualityScore,
        sources: result.sources,
        caption: result.caption,
        confidence: result.confidence,
        contextType: contextType || null,
        description: description || null,
        location: result.location || finalLocation,
        points: result.points,
        userFeedback: null,
        timestamp: new Date().toISOString()
      };

      addContribution(contribution);
      navigate('/results', { state: { contribution } });
    } catch (err) {
      showToast('Failed to process audio. Please try again.', 'error');
      setStep('preview');
    }
  };

  const handleStopAndPreview = () => {
    stopRecording();
    setTimeout(() => setStep('preview'), 500);
  };

  const handleClear = () => {
    clearRecording();
    setStep('record');
  };

  if (step === 'processing') {
    return (
      <div className="screen screen--centered">
        <Loader message="Analyzing your recording..." fact={processingFact} />
      </div>
    );
  }

  return (
    <div className="screen capture-screen">
      {step === 'record' && (
        <div className="capture-screen__content animate-fade-in">
          <h2 className="capture-screen__title">🎤 Record a pollution source</h2>
          <p className="capture-screen__desc">Record audio, we'll convert it to WAV and analyze it.</p>

          {micError && <p className="capture-screen__error">⚠️ {micError}</p>}

          {!permissionGranted && (
            <Button onClick={requestPermission} icon={<span>🎤</span>}>Enable mic</Button>
          )}

          {permissionGranted && !isRecording && !wavBlob && (
            <Button onClick={startRecording} variant="success" icon={<span>⏺️</span>}>Start recording</Button>
          )}

          {isRecording && (
            <div className="capture-screen__recording">
              <div className="capture-screen__record-indicator animate-record-pulse">
                <span>⏺️</span>
              </div>
              <p className="capture-screen__status">Recording... {recordingTime}s / 30s</p>
              <ProgressBar current={recordingTime} max={30} showFraction={false} variant="audio" />
              <Button onClick={handleStopAndPreview} variant="danger" icon={<span>⏹️</span>}>Stop</Button>
            </div>
          )}

          {wavBlob && !isRecording && (
            <div className="capture-screen__actions">
              <Button onClick={() => setStep('preview')}>Preview recording</Button>
            </div>
          )}

          <Button onClick={() => navigate('/dashboard')} variant="secondary">Back</Button>
        </div>
      )}

      {step === 'preview' && wavUrl && (
        <div className="capture-screen__content animate-fade-in">
          <h2 className="capture-screen__title">Preview recording</h2>
          <p className="capture-screen__desc">Duration: {recordingTime}s</p>

          <div className="capture-screen__audio-preview">
            {audioUrl && (
              <div className="capture-screen__audio-player">
                <label className="capture-screen__label">Original:</label>
                <audio controls src={audioUrl} className="capture-screen__audio" />
              </div>
            )}
            <div className="capture-screen__audio-player">
              <label className="capture-screen__label">WAV (will be submitted):</label>
              <audio controls src={wavUrl} className="capture-screen__audio" />
            </div>
          </div>

          <div className="capture-screen__actions">
            <Button onClick={() => setStep('tagging')} variant="success" icon={<span>→</span>}>Continue</Button>
            <Button onClick={handleClear} variant="danger" icon={<span>🗑️</span>}>Delete & Re-record</Button>
            <Button onClick={() => navigate('/dashboard')} variant="secondary">Cancel</Button>
          </div>
        </div>
      )}

      {step === 'tagging' && (
        <div className="capture-screen__content animate-fade-in">
          <h2 className="capture-screen__title">Add context</h2>
          <p className="capture-screen__desc">Where exactly was this and what type of sound is it?</p>

          <div className="capture-screen__field">
            <label className="capture-screen__label">Exact Location</label>
            <LocationPickerMap 
              initialLocation={captureLocation} 
              onLocationChange={setCaptureLocation} 
            />
          </div>

          <div className="capture-screen__field">
            <label className="capture-screen__label">Source type (optional)</label>
            <select
              className="capture-screen__select"
              value={contextType}
              onChange={(e) => setContextType(e.target.value)}
            >
              <option value="">— Select —</option>
              {POLLUTION_TAGS.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.icon} {tag.label}
                </option>
              ))}
            </select>
          </div>

          <div className="capture-screen__field">
            <label className="capture-screen__label">Description (optional)</label>
            <textarea
              className="capture-screen__textarea"
              placeholder="e.g., idling engines nearby"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              rows={3}
            />
          </div>

          <div className="capture-screen__actions">
            <Button onClick={handleSubmit} variant="success" icon={<span>📤</span>}>Submit recording</Button>
            <Button onClick={() => setStep('preview')} variant="secondary">Back to preview</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecordScreen;