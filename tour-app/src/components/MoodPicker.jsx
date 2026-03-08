//src/components/moodpicker.js
import { useState } from 'react'
import { moods, destinations } from '../data/destinations'

export default function MoodPicker({ onPick }) {
  const [selected, setSelected] = useState(null)
  const pick = (m) => {
    setSelected(m.id)
    const ideas = destinations.filter(d => d.mood.includes(m.id))
    onPick?.(m, ideas)
  }
  return (
    <div className="flex flex-wrap gap-2">
      {moods.map(m => (
        <button
          key={m.id}
          className={`px-4 py-2 rounded-xl border transition ${selected===m.id ? 'bg-sky-500 text-white' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
          onClick={() => pick(m)}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}
