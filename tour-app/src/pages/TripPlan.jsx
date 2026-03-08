import { useParams, Link } from 'react-router-dom';
import { trips } from '../data/trips';
import api from '../services/api';
import { useUI } from '../context/UIContext';

export default function TripPlan() {
  const { id } = useParams();
  const { showToast } = useUI();
  const trip = trips.find((t) => t.id === id);

  if (!trip) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold">Trip not found</h2>
        <Link to="/" className="btn-outline mt-4 inline-block">
          Back Home
        </Link>
      </div>
    );
  }

  const addToPlans = async () => {
    try {
      await api.post('/bookings', { type: 'trip', refId: trip.id, title: trip.title });
      showToast('Added to your plans');
    } catch {
      showToast('Failed to add', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-4">{trip.title}</h2>
      <img src={trip.img} alt={trip.title} className="w-full h-64 object-cover rounded-xl mb-6" />
      <h3 className="text-xl font-semibold mb-3">Itinerary</h3>
      <ul className="space-y-3">
        {trip.plan.map((day) => (
          <li key={day.day} className="tile">
            <span className="font-semibold">Day {day.day}:</span> {day.items.join(', ')}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex gap-2">
        <button className="btn-primary" onClick={addToPlans}>
          Add to plans
        </button>
        <Link to="/" className="btn-outline inline-block">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
