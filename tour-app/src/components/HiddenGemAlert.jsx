//src/components//hiddengemalerts.js
import { useEffect, useState } from 'react'
import { hiddenGems } from '../data/gems'
import { useUI } from '../context/UIContext'

export default function HiddenGemAlert({ city }) {
  const [gem, setGem] = useState(null)
  const { showToast } = useUI()

  useEffect(() => {
    const g = hiddenGems.find(h => h.city === city)
    if (g) {
      setGem(g)
      showToast(`Hidden gem: ${g.name} (~${g.walkMinutes} min walk)`)
    }
  }, [city, showToast])

  if (!gem) return null
  return (
    <div className="mt-3 text-sm text-sky-900">
      Tip: {gem.name} is about {gem.walkMinutes} minutes away.
    </div>
  )
}
