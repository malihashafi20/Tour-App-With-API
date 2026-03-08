import { useEffect, useMemo, useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { useJourney } from '../context/JourneyContext';
import { useUI } from '../context/UIContext';
import api from '../services/api';

export default function BudgetCalculator() {
  const { setBudget: saveBudget, addStep, clearBudget } = useJourney();
  const { showToast } = useUI();

  const [days, setDays] = useState(3);
  const [perDayBase, setPerDayBase] = useState(15000);

  const [alloc, setAlloc] = useState({ food: 25, stay: 40, transport: 25, misc: 10 });

  const [addons, setAddons] = useState({ activities: 1500, buffer: 500 });

  const [error, setError] = useState('');

  const totalBase = useMemo(() => Math.max(0, days) * Math.max(0, perDayBase), [days, perDayBase]);
  const totalAddons = useMemo(
    () => Math.max(0, days) * (Math.max(0, addons.activities) + Math.max(0, addons.buffer)),
    [days, addons]
  );
  const totalBudget = useMemo(() => totalBase + totalAddons, [totalBase, totalAddons]);

  const sumAlloc = alloc.food + alloc.stay + alloc.transport + alloc.misc;
  const normalized =
    sumAlloc === 0
      ? { food: 0, stay: 0, transport: 0, misc: 0 }
      : {
          food: alloc.food / sumAlloc,
          stay: alloc.stay / sumAlloc,
          transport: alloc.transport / sumAlloc,
          misc: alloc.misc / sumAlloc,
        };

  const breakdown = {
    food: Math.round(totalBudget * normalized.food),
    stay: Math.round(totalBudget * normalized.stay),
    transport: Math.round(totalBudget * normalized.transport),
    misc: Math.round(totalBudget * normalized.misc),
    addons: {
      activities: Math.round(days * addons.activities),
      buffer: Math.round(days * addons.buffer),
    },
  };

  useEffect(() => {
    if (days < 1) setError('Days must be at least 1.');
    else if (perDayBase < 1000) setError('Per-day base should be at least PKR 1000.');
    else if (sumAlloc === 0) setError('Allocate some percentage to at least one category.');
    else setError('');
  }, [days, perDayBase, sumAlloc]);

  const apply = async () => {
    if (error) {
      showToast(error, 'error');
      return;
    }
    const payload = {
      days,
      perDayBase,
      addons,
      allocationPercent: { ...alloc },
      totalBudget,
      breakdown,
    };
    saveBudget(payload);
    addStep('budget_set', payload);
    showToast('Budget saved');
    try {
      await api.post('/budget', payload);
    } catch {
      // ignore backend failures for UX
    }
  };

  const reset = () => {
    setDays(3);
    setPerDayBase(15000);
    setAlloc({ food: 25, stay: 40, transport: 25, misc: 10 });
    setAddons({ activities: 1500, buffer: 500 });
    clearBudget();
    addStep('budget_reset', { ts: Date.now() });
    showToast('Budget reset');
  };

  const setAllocValue = (key, val) => setAlloc((a) => ({ ...a, [key]: Math.max(0, Number(val)) }));
  const setAddonValue = (key, val) => setAddons((x) => ({ ...x, [key]: Math.max(0, Number(val)) }));

  return (
    <div className="tile">
      <div className="grid md:grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-sm text-slate-600">Days</span>
          <input
            type="number"
            min="1"
            className="border rounded-lg px-3 py-2"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-slate-600">Per-day base (PKR)</span>
          <input
            type="number"
            min="1000"
            step="500"
            className="border rounded-lg px-3 py-2"
            value={perDayBase}
            onChange={(e) => setPerDayBase(Number(e.target.value))}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col">
            <span className="text-sm text-slate-600">Activities per day (PKR)</span>
            <input
              type="number"
              min="0"
              step="100"
              className="border rounded-lg px-3 py-2"
              value={addons.activities}
              onChange={(e) => setAddonValue('activities', e.target.value)}
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm text-slate-600">Buffer per day (PKR)</span>
            <input
              type="number"
              min="0"
              step="100"
              className="border rounded-lg px-3 py-2"
              value={addons.buffer}
              onChange={(e) => setAddonValue('buffer', e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold mb-2">Allocation (%)</h4>
        <p className="text-xs text-slate-600 mb-3">Total: {sumAlloc}% (auto-normalized)</p>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { key: 'food', label: 'Food' },
            { key: 'stay', label: 'Stay' },
            { key: 'transport', label: 'Transport' },
            { key: 'misc', label: 'Misc' },
          ].map((item) => (
            <div key={item.key} className="tile p-3">
              <span className="text-sm text-slate-700 font-semibold">{item.label}</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={alloc[item.key]}
                onChange={(e) => setAllocValue(item.key, e.target.value)}
                className="w-full mt-2"
              />
              <div className="text-xs text-slate-600 mt-1">{alloc[item.key]}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-3 text-sm">
        <div className="tile p-3">
          <span className="font-semibold">Total budget</span>
          <div>{formatCurrency(totalBudget)}</div>
          <div className="text-xs text-slate-500">
            Base: {formatCurrency(totalBase)} • Addons: {formatCurrency(totalAddons)}
          </div>
        </div>
        <div className="tile p-3">
          <span className="font-semibold">Food</span>
          <div>{formatCurrency(breakdown.food)}</div>
        </div>
        <div className="tile p-3">
          <span className="font-semibold">Stay</span>
          <div>{formatCurrency(breakdown.stay)}</div>
        </div>
        <div className="tile p-3">
          <span className="font-semibold">Transport</span>
          <div>{formatCurrency(breakdown.transport)}</div>
        </div>
        <div className="tile p-3">
          <span className="font-semibold">Misc</span>
          <div>{formatCurrency(breakdown.misc)}</div>
        </div>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
        <div className="tile p-3">
          <span className="font-semibold">Activities total</span>
          <div>{formatCurrency(breakdown.addons.activities)}</div>
        </div>
        <div className="tile p-3">
          <span className="font-semibold">Buffer total</span>
          <div>{formatCurrency(breakdown.addons.buffer)}</div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="btn-primary" onClick={apply}>
          Save budget
        </button>
        <button className="btn-outline" onClick={reset}>
          Reset
        </button>
      </div>

      {error && <div className="mt-3 text-sm text-rose-600">{error}</div>}
    </div>
  );
}
