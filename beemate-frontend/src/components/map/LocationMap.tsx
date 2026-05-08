import React, { useEffect, useRef } from 'react';
import type { GeoLocation } from '../../types';
import './LocationMap.css';

interface LocationMapProps {
  location: GeoLocation;
  label?: string;
  height?: string;
}

/**
 * Leaflet map component showing a single marker
 * Uses dynamic import to avoid SSR issues
 */
export const LocationMap: React.FC<LocationMapProps> = ({
  location, label = 'Pollution source found here', height = '200px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = await import('leaflet');

      const map = L.map(mapRef.current!, {
        center: [location.latitude, location.longitude],
        zoom: 16,
        zoomControl: true,
        attributionControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const icon = L.divIcon({
        className: 'custom-marker',
        html: '<div class="marker-pin">📍</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      });

      L.marker([location.latitude, location.longitude], { icon })
        .addTo(map)
        .bindPopup(label)
        .openPopup();

      mapInstanceRef.current = map;

      setTimeout(() => map.invalidateSize(), 100);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location.latitude, location.longitude, label]);

  return (
    <div className="location-map">
      <div ref={mapRef} className="location-map__container" style={{ height }} />
      <div className="location-map__coords">
        Lat: {location.latitude.toFixed(5)}, Lng: {location.longitude.toFixed(5)}
        {location.accuracy && ` (±${Math.round(location.accuracy)}m)`}
      </div>
    </div>
  );
};