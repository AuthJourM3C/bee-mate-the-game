import { useState, useCallback, useRef } from 'react';

interface UseAudioRecorderReturn {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  wavBlob: Blob | null;
  wavUrl: string | null;
  error: string | null;
  permissionGranted: boolean;
  requestPermission: () => Promise<boolean>;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearRecording: () => void;
  setPreSelectedFile: (file: File) => Promise<void>;
}

const MAX_DURATION = 30;

/**
 * Hook for audio recording with WAV conversion
 * Records up to 30 seconds, converts to WAV for backend submission
 */
export const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [wavBlob, setWavBlob] = useState<Blob | null>(null);
  const [wavUrl, setWavUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setPermissionGranted(true);
      setError(null);
      return true;
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access in your browser settings.');
      setPermissionGranted(false);
      return false;
    }
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    chunksRef.current = [];
    setRecordingTime(0);

    let stream = streamRef.current;
    if (!stream) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 }
        });
        streamRef.current = stream;
        setPermissionGranted(true);
      } catch (err) {
        setError('Microphone access denied.');
        return;
      }
    }

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm';

    const recorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      setAudioBlob(blob);
      setAudioUrl(URL.createObjectURL(blob));

      try {
        const wav = await convertToWav(blob);
        setWavBlob(wav);
        setWavUrl(URL.createObjectURL(wav));
      } catch (err) {
        console.warn('WAV conversion failed, using original:', err);
        setWavBlob(blob);
        setWavUrl(URL.createObjectURL(blob));
      }

      if (timerRef.current) clearInterval(timerRef.current);
    };

    recorder.start(100);
    setIsRecording(true);

    let elapsed = 0;
    timerRef.current = setInterval(() => {
      elapsed += 1;
      setRecordingTime(elapsed);
      if (elapsed >= MAX_DURATION) {
        recorder.stop();
        setIsRecording(false);
      }
    }, 1000);
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
  }, []);

  const setPreSelectedFile = useCallback(async (file: File) => {
    stopRecording();
    setAudioBlob(file);
    setAudioUrl(URL.createObjectURL(file));

    try {
      const wav = await convertToWav(file);
      setWavBlob(wav);
      setWavUrl(URL.createObjectURL(wav));
    } catch (err) {
      console.warn('WAV conversion failed for selected file, using original:', err);
      setWavBlob(file);
      setWavUrl(URL.createObjectURL(file));
    }
  }, [stopRecording]);

  const clearRecording = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    if (wavUrl) URL.revokeObjectURL(wavUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setWavBlob(null);
    setWavUrl(null);
    setRecordingTime(0);
    setError(null);
  }, [audioUrl, wavUrl]);

  return {
    isRecording, isPaused, recordingTime, audioBlob, audioUrl,
    wavBlob, wavUrl, error, permissionGranted,
    requestPermission, startRecording, stopRecording, clearRecording,
    setPreSelectedFile
  };
};

/**
 * Convert audio blob to WAV format using AudioContext
 */
async function convertToWav(blob: Blob): Promise<Blob> {
  const audioContext = new AudioContext({ sampleRate: 44100 });
  const arrayBuffer = await blob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length;

  const wavBuffer = new ArrayBuffer(44 + length * numChannels * 2);
  const view = new DataView(wavBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * numChannels * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * numChannels * 2, true);

  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(ch)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }

  await audioContext.close();
  return new Blob([wavBuffer], { type: 'audio/wav' });
}