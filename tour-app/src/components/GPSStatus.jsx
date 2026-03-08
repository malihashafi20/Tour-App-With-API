// src/components/GPSStatus.jsx
import { useEffect, useRef } from 'react';
import { useJourney } from '../context/JourneyContext';
import api from '../services/api';

export default function GPSStatus() {
  const { gps, setGps, addStep } = useJourney();
  const lastUpdateTimeRef = useRef(0);
  const lastPosRef = useRef(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGps({ status: 'unsupported', position: null, accuracy: null });
      return;
    }
    const THROTTLE_MS = 30000;
    const MIN_MOVE_METERS = 50;
    const toRad = (v) => (v * Math.PI) / 180;
    const distMeters = (a, b) => {
      if (!a || !b) return Infinity;
      const R = 6371000;
      const dLat = toRad(b.lat - a.lat);
      const dLon = toRad(b.lng - a.lng);
      const lat1 = toRad(a.lat);
      const lat2 = toRad(b.lat);
      const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
      return 2 * R * Math.asin(Math.sqrt(h));
    };

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const now = Date.now();
        const data = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        setGps({ status: 'ok', position: data, accuracy: data.accuracy });

        const moved = distMeters(lastPosRef.current, data) >= MIN_MOVE_METERS;
        const throttled = now - lastUpdateTimeRef.current >= THROTTLE_MS;

        if (moved && throttled) {
          lastUpdateTimeRef.current = now;
          lastPosRef.current = data;
          addStep('gps_update', data);
          // Persist to backend
          try {
            await api.post('/location', data);
          } catch {
            // Non-blocking
          }
        } else {
          lastPosRef.current = data;
        }
      },
      () => setGps({ status: 'error', position: null, accuracy: null }),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [setGps, addStep]);

  const badge =
    gps.status === 'ok'
      ? 'bg-emerald-100 text-emerald-700'
      : gps.status === 'error'
      ? 'bg-rose-100 text-rose-700'
      : gps.status === 'unsupported'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-slate-100 text-slate-700';

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl ${badge}`}>
      <span className="font-semibold">GPS:</span>
      <span>{gps.status}</span>
      {gps.position && (
        <span>
          ({gps.position.lat.toFixed(3)}, {gps.position.lng.toFixed(3)}) ±{Math.round(gps.accuracy)}m
        </span>
      )}
      {gps.status === 'unsupported' && <span>Device does not support location.</span>}
      {gps.status === 'error' && <span>Unable to get your location.</span>}
    </div>
  );
}
