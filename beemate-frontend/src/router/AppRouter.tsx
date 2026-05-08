import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader } from '../components/common/Loader';

const HomeScreen = lazy(() => import('../screens/HomeScreen'));
const NameInputScreen = lazy(() => import('../screens/NameInputScreen'));
const ModeSelectScreen = lazy(() => import('../screens/ModeSelectScreen'));
const PasscodeEntryScreen = lazy(() => import('../screens/PasscodeEntryScreen'));
const ExplorerWelcomeScreen = lazy(() => import('../screens/ExplorerWelcomeScreen'));
const CharacterRevealScreen = lazy(() => import('../screens/CharacterRevealScreen'));
const ExplorerDashboard = lazy(() => import('../screens/ExplorerDashboard'));
const PhotoCaptureScreen = lazy(() => import('../screens/PhotoCaptureScreen'));
const AudioRecordScreen = lazy(() => import('../screens/AudioRecordScreen'));
const ResultsScreen = lazy(() => import('../screens/ResultsScreen'));
const EvolutionScreen = lazy(() => import('../screens/EvolutionScreen'));
const MyMapScreen = lazy(() => import('../screens/MyMapScreen'));

const LoadingFallback: React.FC = () => (
  <div className="screen screen--centered">
    <Loader message="Loading..." />
  </div>
);

/**
 * Application router - all routes for Explorer mode
 */
export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Entry */}
        <Route path="/" element={<HomeScreen />} />
        <Route path="/name" element={<NameInputScreen />} />
        <Route path="/mode-select" element={<ModeSelectScreen />} />
        <Route path="/passcode" element={<PasscodeEntryScreen />} />

        {/* Explorer onboarding */}
        <Route path="/explorer-welcome" element={<ExplorerWelcomeScreen />} />
        <Route path="/character-reveal" element={<CharacterRevealScreen />} />

        {/* Main hub */}
        <Route path="/dashboard" element={<ExplorerDashboard />} />

        {/* Capture flows */}
        <Route path="/capture/photo" element={<PhotoCaptureScreen />} />
        <Route path="/capture/audio" element={<AudioRecordScreen />} />

        {/* Results */}
        <Route path="/results" element={<ResultsScreen />} />

        {/* Evolution */}
        <Route path="/evolution" element={<EvolutionScreen />} />

        {/* Map */}
        <Route path="/my-map" element={<MyMapScreen />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};