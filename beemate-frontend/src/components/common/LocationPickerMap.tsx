import React, { useEffect, useRef, useState } from 'react';
import type { GeoLocation } from '../../types';
import './LocationPickerMap.css';

interface LocationPickerMapProps {
  initialLocation: GeoLocation | null;
  onLocationChange: (location: GeoLocation) => void;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({ initialLocation, onLocationChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || !initialLocation) return;

    const initMap = async () => {
      try {
        const L = await import('leaflet');
        
        const map = L.map(mapRef.current!, {
          center: [initialLocation.latitude, initialLocation.longitude],
          zoom: 16
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const customIcon = L.divIcon({
          className: 'custom-map-marker custom-map-marker--primary',
          html: `<span>📍</span>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });

        const marker = L.marker([initialLocation.latitude, initialLocation.longitude], { 
          icon: customIcon,
          draggable: true 
        }).addTo(map);

        markerRef.current = marker;
        mapInstanceRef.current = map;

        marker.on('dragend', () => {
          const position = marker.getLatLng();
          onLocationChange({
            ...initialLocation,
            latitude: position.lat,
            longitude: position.lng
          });
        });

        setTimeout(() => map.invalidateSize(), 150);
        setIsInitializing(false);
      } catch (err) {
        console.error("Failed to load map:", err);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initialLocation, onLocationChange]);

  if (!initialLocation) {
    return <div className="location-picker-map__loading">Waiting for location...</div>;
  }

  return (
    <div className="location-picker-map">
      <div ref={mapRef} className="location-picker-map__container" />
      <div className="location-picker-map__hint">Drag the pin to adjust the exact location</div>
    </div>
  );
};
