import { useState, useCallback } from 'react';
import type { GeoLocation } from '../types';

interface UseGeolocationReturn {
  location: GeoLocation | null;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<GeoLocation | null>;
}

/**
 * Hook for GPS geolocation
 */
export const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async (): Promise<GeoLocation | null> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return null;
    }

    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: GeoLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          setLocation(loc);
          setIsLoading(false);
          resolve(loc);
        },
        (err) => {
          let msg = 'Unable to get location.';
          if (err.code === 1) msg = 'Location access denied. Please enable location services.';
          else if (err.code === 2) msg = 'Location unavailable. Please try again.';
          else if (err.code === 3) msg = 'Location request timed out.';
          setError(msg);
          setIsLoading(false);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 30000
        }
      );
    });
  }, []);

  return { location, isLoading, error, getCurrentLocation };
};