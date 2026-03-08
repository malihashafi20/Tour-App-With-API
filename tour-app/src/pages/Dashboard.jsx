import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    api
      .get('/dashboard')
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        const status = err.response?.status;
        if (status === 401) {
          setErrMsg('Session expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setErrMsg(err.response?.data?.message || 'Failed to load dashboard.');
          setLoading(false);
        }
      });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  const {
    name = 'Traveler',
    email = '—',
    phone = '—',
    joined = null,
    budget,
    route,
    bookings = [],
  } = data || {};

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {errMsg && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-700">
            {errMsg}
          </div>
        )}

        <div className="bg-blue-600 text-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-3xl font-bold">Welcome back, {name} 👋</h2>
          <p className="mt-2 text-blue-100">Your planning overview at a glance.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold">Bookings</h3>
            <p className="text-2xl font-bold text-blue-600">{bookings.length}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold">Budget total</h3>
            <p className="text-2xl font-bold text-blue-600">
              {budget?.totalBudget ? formatCurrency(budget.totalBudget) : '—'}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold">Route cost</h3>
            <p className="text-2xl font-bold text-blue-600">
              {route?.cost ? `PKR ${route.cost}` : '—'}
            </p>
          </div>
        </div>

        {/* Account details */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Account details</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {name}</p>
            <p><span className="font-medium">Email:</span> {email}</p>
            <p><span className="font-medium">Phone:</span> {phone}</p>
            <p><span className="font-medium">Joined:</span> {joined ? new Date(joined).toLocaleString() : '—'}</p>
          </div>
        </div>

        {/* Budget summary */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Budget</h3>
          {budget ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 text-sm">
              <div className="tile p-3">
                <span className="font-semibold">Total</span>
                <div>{formatCurrency(budget.totalBudget)}</div>
              </div>
              <div className="tile p-3"><span className="font-semibold">Food</span><div>{formatCurrency(budget.breakdown.food)}</div></div>
              <div className="tile p-3"><span className="font-semibold">Stay</span><div>{formatCurrency(budget.breakdown.stay)}</div></div>
              <div className="tile p-3"><span className="font-semibold">Transport</span><div>{formatCurrency(budget.breakdown.transport)}</div></div>
              <div className="tile p-3"><span className="font-semibold">Misc</span><div>{formatCurrency(budget.breakdown.misc)}</div></div>
            </div>
          ) : (
            <p className="text-slate-600">No budget saved yet.</p>
          )}
        </div>

        {/* Route summary */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Route</h3>
          {route ? (
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="tile p-3"><span className="font-semibold">Start</span><div>({route.start.lat}, {route.start.lng})</div></div>
              <div className="tile p-3"><span className="font-semibold">End</span><div>({route.end.lat}, {route.end.lng})</div></div>
              <div className="tile p-3"><span className="font-semibold">Distance</span><div>{route.distanceKm} km</div></div>
              <div className="tile p-3"><span className="font-semibold">Cost</span><div>PKR {route.cost}</div></div>
            </div>
          ) : (
            <p className="text-slate-600">No route saved yet.</p>
          )}
        </div>

        {/* Bookings list */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Your bookings</h3>
          {bookings.length ? (
            <ul className="space-y-2">
              {bookings.map((b) => (
                <li key={b._id} className="tile p-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold">{b.title || b.refId}</span>
                    <span className="ml-2 text-xs text-slate-600">({b.type})</span>
                  </div>
                  <div className="text-xs text-slate-600">{new Date(b.ts).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600">No bookings yet. Add a trip from Services or Trip detail.</p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={logout}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
