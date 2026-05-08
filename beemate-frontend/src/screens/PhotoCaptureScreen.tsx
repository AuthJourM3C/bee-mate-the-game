import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCamera } from '../hooks/useCamera';
import { useGeolocation } from '../hooks/useGeolocation';
import { useGameStore } from '../store/gameStore';
import { useToast } from '../context/ToastContext';
import { identifyImage } from '../services/identifyService';
import { POLLUTION_TAGS } from '../config/pollutionTags';
import { getRandomFact } from '../config/pollutionFacts';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
import { LocationPickerMap } from '../components/common/LocationPickerMap';
import type { GeoLocation } from '../types';
import './CaptureScreen.css';

/**
 * Photo capture screen - camera → preview → context tagging → submit → processing
 */
const PhotoCaptureScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { capturedImage, capturedImageUrl, isCapturing, videoRef, startCamera, takePhoto, stopCamera, clearCapture, error: cameraError, setPreSelectedFile } = useCamera();
  const { getCurrentLocation } = useGeolocation();
  const addContribution = useGameStore((s) => s.addContribution);

  const [step, setStep] = useState<'capture' | 'preview' | 'tagging' | 'processing'>('capture');
  const [contextType, setContextType] = useState('');
  const [description, setDescription] = useState('');
  const [processingFact, setProcessingFact] = useState('');
  const [captureLocation, setCaptureLocation] = useState<GeoLocation | null>(null);

  // Check for pre-selected file from dashboard
  useEffect(() => {
    const preSelectedFile = location.state?.preSelectedFile as File | undefined;
    if (preSelectedFile && step === 'capture') {
      window.history.replaceState({}, document.title); // clear state to prevent loop
      setPreSelectedFile(preSelectedFile);
    }
  }, [location.state, step, setPreSelectedFile]);

  // Get location when entering tagging step
  useEffect(() => {
    if (step === 'tagging' && !captureLocation) {
      getCurrentLocation().then(loc => setCaptureLocation(loc)).catch(console.error);
    }
  }, [step, captureLocation, getCurrentLocation]);

  useEffect(() => {
    if (capturedImage && step === 'capture') {
      setStep('preview');
    }
  }, [capturedImage]);

  // Clean up camera when leaving screen
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const handleRetake = () => {
    clearCapture();
    setStep('capture');
    startCamera();
  };

  const handleContinueToTag = () => {
    setStep('tagging');
  };

  const handleSubmit = async () => {
    if (!capturedImage) return;
    setProcessingFact(getRandomFact());
    setStep('processing');

    try {
      const result = await identifyImage(
        capturedImage,
        contextType || undefined,
        description || undefined
      );

      const finalLocation = captureLocation || await getCurrentLocation();

      const contribution = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        mediaType: 'image' as const,
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
      showToast('Failed to process image. Please try again.', 'error');
      setStep('preview');
    }
  };

  const handleCancelCapture = () => {
    stopCamera();
    navigate('/dashboard');
  };

  if (step === 'processing') {
    return (
      <div className="screen screen--centered">
        <Loader message="Analyzing your photo..." fact={processingFact} />
      </div>
    );
  }

  return (
    <div className="screen capture-screen">
      {step === 'capture' && (
        <div className="capture-screen__content animate-fade-in">
          <h2 className="capture-screen__title">📷 Take a photo</h2>
          <p className="capture-screen__desc">Capture a pollution source around you.</p>
          
          {cameraError && <p className="capture-screen__error">⚠️ {cameraError}</p>}
          
          <div className="capture-screen__camera-container">
            <video 
              ref={videoRef} 
              className="capture-screen__video" 
              style={{ display: isCapturing ? 'block' : 'none' }}
              playsInline 
              muted
            />
            {!isCapturing && (
              <div className="capture-screen__video-placeholder">
                <span>📷</span>
              </div>
            )}
          </div>

          <div className="capture-screen__actions">
            {!isCapturing ? (
              <Button onClick={() => startCamera()} icon={<span>🎥</span>}>Start Camera</Button>
            ) : (
              <Button onClick={() => takePhoto()} variant="success" size="lg" icon={<span>📸</span>}>Capture Photo</Button>
            )}
            <Button onClick={handleCancelCapture} variant="secondary">Back</Button>
          </div>
        </div>
      )}

      {step === 'preview' && capturedImageUrl && (
        <div className="capture-screen__content animate-fade-in">
          <h2 className="capture-screen__title">Preview</h2>
          <div className="capture-screen__preview">
            <img src={capturedImageUrl} alt="Captured" className="capture-screen__image" />
          </div>
          <div className="capture-screen__actions">
            <Button onClick={handleContinueToTag} variant="success" icon={<span>→</span>}>Continue</Button>
            <Button onClick={handleRetake} variant="danger" icon={<span>🗑️</span>}>Delete & Retake</Button>
            <Button onClick={() => navigate('/dashboard')} variant="secondary">Cancel</Button>
          </div>
        </div>
      )}

      {step === 'tagging' && (
        <div className="capture-screen__content animate-fade-in">
          <h2 className="capture-screen__title">Add context</h2>
          <p className="capture-screen__desc">Where exactly was this and what type of pollution is it?</p>

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
              placeholder="e.g., heavy traffic near school"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              rows={3}
            />
          </div>

          <div className="capture-screen__actions">
            <Button onClick={handleSubmit} variant="success" icon={<span>📤</span>}>Submit</Button>
            <Button onClick={() => setStep('preview')} variant="secondary">Back to preview</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoCaptureScreen;