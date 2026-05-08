import { useState, useCallback, useRef, useEffect } from 'react';

interface UseCameraReturn {
  capturedImage: Blob | null;
  capturedImageUrl: string | null;
  isCapturing: boolean;
  error: string | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  startCamera: () => Promise<void>;
  takePhoto: () => void;
  clearCapture: () => void;
  stopCamera: () => void;
  setPreSelectedFile: (file: File) => void;
}

/**
 * Hook for camera capture using WebRTC (getUserMedia)
 * Opens the actual camera inside the browser on all devices.
 */
export const useCamera = (): UseCameraReturn => {
  const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    setCapturedImage(null);
    if (capturedImageUrl) URL.revokeObjectURL(capturedImageUrl);
    setCapturedImageUrl(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCapturing(true);
    } catch (err) {
      setError('Camera access failed. Please allow camera permissions.');
      setIsCapturing(false);
    }
  }, [capturedImageUrl]);

  const takePhoto = useCallback(() => {
    if (!videoRef.current || !streamRef.current) return;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Failed to capture image');
      return;
    }

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to Blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCapturedImage(blob);
          setCapturedImageUrl(URL.createObjectURL(blob));
          stopCamera(); // Stop video stream after capture
        } else {
          setError('Failed to process image');
        }
      },
      'image/jpeg',
      0.8
    );
  }, [stopCamera]);

  const setPreSelectedFile = useCallback((file: File) => {
    stopCamera();
    setCapturedImage(file);
    setCapturedImageUrl(URL.createObjectURL(file));
  }, [stopCamera]);

  const clearCapture = useCallback(() => {
    if (capturedImageUrl) {
      URL.revokeObjectURL(capturedImageUrl);
    }
    setCapturedImage(null);
    setCapturedImageUrl(null);
    setError(null);
  }, [capturedImageUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (capturedImageUrl) URL.revokeObjectURL(capturedImageUrl);
    };
  }, [stopCamera, capturedImageUrl]);

  return { 
    capturedImage, 
    capturedImageUrl, 
    isCapturing, 
    error, 
    videoRef, 
    startCamera, 
    takePhoto, 
    clearCapture,
    stopCamera,
    setPreSelectedFile
  };
};