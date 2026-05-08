import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Button } from '../components/common/Button';
import './MyMapScreen.css';

/**
 * Map screen showing all player contributions
 */
const MyMapScreen: React.FC = () => {
  const navigate = useNavigate();
  const contributions = useGameStore((s) => s.contributions);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const contributionsWithLocation = contributions.filter(c => c.location);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || contributionsWithLocation.length === 0) return;

    const initMap = async () => {
      const L = await import('leaflet');

      const firstLoc = contributionsWithLocation[0].location!;
      const map = L.map(mapRef.current!, {
        center: [firstLoc.latitude, firstLoc.longitude],
        zoom: 15
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const bounds = L.latLngBounds([]);

      contributionsWithLocation.forEach((c) => {
        if (!c.location) return;

        const isPollution = c.classification === 'R';

        if (isPollution && c.sources && c.sources.length > 0) {
          c.sources.forEach((s, index) => {
            // Offset slightly if there are multiple sources to prevent strict graphical overlapping
            const offsetLat = c.location!.latitude + (index * 0.00008);
            const offsetLng = c.location!.longitude + (index * 0.00008);

            const customIcon = L.divIcon({
              className: 'custom-map-marker custom-map-marker--danger',
              html: `<span>${s.icon}</span>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            });

            const marker = L.marker([offsetLat, offsetLng], { icon: customIcon });

            marker.bindPopup(`
              <div style="font-size: 1.1rem; padding: 4px;">
                <strong style="color: #ef4444; font-size: 1.2rem; display: block; margin-bottom: 4px;">
                  ${s.icon} ${s.label}
                </strong>
                <span style="font-size: 1.05rem;">Pollution Detected</span><br/>
                <span style="font-weight: bold;">Points: +${Math.round(c.points.total / c.sources!.length)}</span><br/>
                <small style="color: #64748b;">${new Date(c.timestamp).toLocaleString()}</small>
              </div>
            `);

            marker.addTo(map);
            bounds.extend([offsetLat, offsetLng]);
          });
        } else {
          // Simple dot for No Pollution or blank
          const marker = L.circleMarker([c.location.latitude, c.location.longitude], {
            radius: 8,
            fillColor: '#94a3b8',
            color: '#94a3b8',
            fillOpacity: 0.7,
            weight: 2
          });

          marker.bindPopup(`
            <div style="font-size: 1.1rem; padding: 4px;">
              <strong style="color: #64748b; font-size: 1.2rem; display: block; margin-bottom: 4px;">
                No pollution
              </strong>
              <small style="color: #64748b;">${new Date(c.timestamp).toLocaleString()}</small>
            </div>
          `);

          marker.addTo(map);
          bounds.extend([c.location.latitude, c.location.longitude]);
        }
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }

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
  }, [contributionsWithLocation.length]);

  return (
    <div className="screen my-map-screen">
      <h2 className="my-map-screen__title">🗺️ My Contributions</h2>

      {contributionsWithLocation.length === 0 ? (
        <div className="my-map-screen__empty animate-fade-in">
          <span className="my-map-screen__empty-icon">🗺️</span>
          <p>No contributions with location yet.</p>
          <p className="text-sm text-muted">Take a photo or record audio to see your markers!</p>
        </div>
      ) : (
        <div className="my-map-screen__map-container animate-fade-in">
          <div ref={mapRef} className="my-map-screen__map" />
          <div className="my-map-screen__legend">
            <span className="my-map-screen__legend-item">
              <span className="my-map-screen__legend-dot my-map-screen__legend-dot--r" />
              Pollution detected (R)
            </span>
            <span className="my-map-screen__legend-item">
              <span className="my-map-screen__legend-dot my-map-screen__legend-dot--nr" />
              No pollution (NR)
            </span>
          </div>
        </div>
      )}

      <div className="my-map-screen__actions">
        <Button onClick={() => navigate('/dashboard')} variant="secondary">
          Back to dashboard
        </Button>
      </div>
    </div>
  );
};

export default MyMapScreen;