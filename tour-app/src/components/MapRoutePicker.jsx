
// src/components/MapRoutePicker.jsx
import { useState } from 'react';
import { useJourney } from '../context/JourneyContext';
import { useUI } from '../context/UIContext';
import { haversineDistance } from '../utils/haversine';
import api from '../services/api';

const isValidLat = (lat) => lat >= -90 && lat <= 90;
const isValidLng = (lng) => lng >= -180 && lng <= 180;

export default function MapRoutePicker() {
  const defaultStart = { lat: 31.52, lng: 74.358 }; // Lahore
  const defaultEnd = { lat: 35.297, lng: 75.633 }; // Skardu
  const defaultRate = 35;

  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);
  const [rate, setRate] = useState(defaultRate);
  const [error, setError] = useState('');

  const { setRoute, addStep, clearRoute } = useJourney();
  const { showToast } = useUI();

  const distanceKm = haversineDistance(start, end);
  const cost = Math.round(distanceKm * Math.max(0, rate));

  const validate = () => {
    if (!isValidLat(start.lat) || !isValidLng(start.lng)) return 'Invalid start coordinates';
    if (!isValidLat(end.lat) || !isValidLng(end.lng)) return 'Invalid end coordinates';
    if (rate < 1) return 'Rate must be at least 1 PKR/km';
    return '';
  };

  const save = async () => {
    const v = validate();
    if (v) {
      setError(v);
      showToast(v, 'error');
      return;
    }
    const r = {
      start,
      end,
      distanceKm: Number(distanceKm.toFixed(2)),
      rate,
      cost,
    };
    setRoute(r);
    addStep('route_set', r);
    showToast('Route saved');

    // Persist to backend
    try {
      await api.post('/route', r);
    } catch {
      // Non-blocking
    }
  };

  const reset = () => {
    setStart(defaultStart);
    setEnd(defaultEnd);
    setRate(defaultRate);
    setError('');
    clearRoute();
    addStep('route_reset', { ts: Date.now() });
    showToast('Route reset');
  };

  return (
    <div className="tile">
      <h4 className="font-semibold mb-3">Choose route (lat/lng)</h4>

      {error && <div className="mb-2 text-sm text-rose-700">{error}</div>}

      <div className="grid sm:grid-cols-3 gap-3">
        <div className="tile p-3">
          <span className="text-sm text-slate-600">Start</span>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <input
              aria-label="Start latitude"
              className="border rounded-lg px-3 py-2"
              type="number"
              value={start.lat}
              onChange={(e) => setStart((s) => ({ ...s, lat: Number(e.target.value) }))}
            />
            <input
              aria-label="Start longitude"
              className="border rounded-lg px-3 py-2"
              type="number"
              value={start.lng}
              onChange={(e) => setStart((s) => ({ ...s, lng: Number(e.target.value) }))}
            />
          </div>
        </div>

        <div className="tile p-3">
          <span className="text-sm text-slate-600">End</span>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <input
              aria-label="End latitude"
              className="border rounded-lg px-3 py-2"
              type="number"
              value={end.lat}
              onChange={(e) => setEnd((s) => ({ ...s, lat: Number(e.target.value) }))}
            />
            <input
              aria-label="End longitude"
              className="border rounded-lg px-3 py-2"
              type="number"
              value={end.lng}
              onChange={(e) => setEnd((s) => ({ ...s, lng: Number(e.target.value) }))}
            />
          </div>
        </div>

        <div className="tile p-3">
          <span className="text-sm text-slate-600">Rate (PKR/km)</span>
          <input
            aria-label="Rate PKR per km"
            className="border rounded-lg px-3 py-2 mt-2 w-full"
            type="number"
            min="1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
          />
          <div className="mt-3 text-sm">
            <div>
              <span className="font-semibold">Distance:</span> {distanceKm.toFixed(1)} km
            </div>
            <div>
              <span className="font-semibold">Cost:</span> PKR {cost}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="btn-primary" onClick={save}>
          Save route
        </button>
        <button className="btn-outline" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
