//src/context/journeycontext.js
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadJSON, saveJSON } from '../utils/storage'

const JourneyContext = createContext(null)

const MAX_STEPS = 20

export function JourneyProvider({ children }) {
  const [steps, setSteps] = useState(() => loadJSON('journey_steps', []))
  const [route, setRoute] = useState(() => loadJSON('journey_route', null))
  const [budget, setBudget] = useState(() => loadJSON('journey_budget', null))
  const [decisions, setDecisions] = useState(() => loadJSON('journey_decisions', []))
  const [gps, setGps] = useState({ status: 'idle', position: null, accuracy: null })

  useEffect(() => saveJSON('journey_steps', steps), [steps])
  useEffect(() => saveJSON('journey_route', route), [route])
  useEffect(() => saveJSON('journey_budget', budget), [budget])
  useEffect(() => saveJSON('journey_decisions', decisions), [decisions])

  const addStep = (label, payload) =>
    setSteps(prev => {
      const next = [...prev, { ts: Date.now(), label, payload }]
      return next.slice(-MAX_STEPS)
    })

  const clearSteps = () => setSteps([])

  const addDecision = (text) =>
    setDecisions(prev => [...prev, { ts: Date.now(), text }])

  // Budget helpers
  const clearBudget = () => setBudget(null)

  // Route helpers
  const clearRoute = () => setRoute(null)

  const value = useMemo(
    () => ({
      steps, addStep, clearSteps,
      route, setRoute, clearRoute,
      budget, setBudget, clearBudget,
      decisions, addDecision,
      gps, setGps
    }),
    [steps, route, budget, decisions, gps]
  )

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
}

export const useJourney = () => useContext(JourneyContext)
