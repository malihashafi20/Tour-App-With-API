import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { JourneyProvider } from './context/JourneyContext'
import { UIProvider } from './context/UIContext'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UIProvider>
        <JourneyProvider>
          <App />
        </JourneyProvider>
      </UIProvider>
    </BrowserRouter>
  </React.StrictMode>
)
