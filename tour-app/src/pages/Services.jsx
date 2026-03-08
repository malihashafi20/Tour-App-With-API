import { weekendItineraries } from '../data/itineraries';
import { snacksByCity } from '../data/snacks';
import { trips } from '../data/trips';
import SnackCard from '../components/SnackCard';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useUI } from '../context/UIContext';

export default function Services() {
  const { showToast } = useUI();
  const displayTrips = trips.map((t) => ({ ...t, tag: t.tag === 'Romantic' ? 'Scenic' : t.tag }));

  const addToPlans = async (t) => {
    try {
      await api.post('/bookings', { type: 'trip', refId: t.id, title: t.title });
      showToast('Added to your plans');
    } catch {
      showToast('Failed to add', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="font-[Poppins] text-3xl font-bold">Services</h2>

      <section id="weekend" className="mt-6 grid md:grid-cols-2 gap-6" role="region" aria-label="Weekend itineraries">
        {weekendItineraries.map((it) => (
          <div key={it.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow">
            <img src={it.cover} alt={`${it.city} cover`} className="h-40 w-full object-cover" />
            <div className="p-5">
              <h3 className="font-semibold text-xl">
                {it.city} — {it.days} days
              </h3>
              <p className="text-slate-700">{it.summary}</p>
              <ul className="mt-3 text-sm space-y-1">
                {it.plan.map((p) => (
                  <li key={p.day} className="border-b border-slate-200 pb-1">
                    <span className="font-semibold">Day {p.day}:</span> {p.items.join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      <section id="trips" className="mt-10" role="region" aria-label="Popular trips">
        <div className="flex items-end justify-between">
          <h3 className="font-semibold text-xl">Popular Trips</h3>
          <Link to="/" className="text-sm text-sky-600 hover:underline">
            Back to Home
          </Link>
        </div>
        <p className="text-slate-700 mt-1">Explore curated trips and open a detailed plan for each destination.</p>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {displayTrips.map((t) => (
            <article key={t.id} className="relative group overflow-hidden rounded-2xl shadow">
              <img
                src={t.img}
                alt={t.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition" />
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="font-semibold">{t.title}</h4>
                <span className="text-xs bg-sky-500 px-2 py-1 rounded">{t.tag}</span>
              </div>

              <div className="absolute bottom-4 right-4 flex gap-2">
                <Link
                  to={`/trip/${t.id}`}
                  className="btn-primary opacity-0 group-hover:opacity-100 transition"
                  aria-label={`Discover ${t.title}`}
                >
                  Discover
                </Link>
                <button
                  className="btn-outline opacity-0 group-hover:opacity-100 transition"
                  onClick={() => addToPlans(t)}
                  aria-label={`Add ${t.title} to plans`}
                >
                  Add to plans
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="snacks" className="mt-10" role="region" aria-label="Local snack finder">
        <h3 className="font-semibold text-xl mb-3">Local Snack Finder</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(snacksByCity).map(([city, snacks]) => (
            <div key={city} className="tile">
              <h4 className="font-semibold">{city}</h4>
              <div className="mt-3 grid gap-3">
                {snacks.map((s, i) => (
                  <SnackCard key={i} snack={s} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
