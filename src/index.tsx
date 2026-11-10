// Import global styles here instead on in index.html to work right with Parcel 2.16,
// which seems to put component CSS first.
import '../style/style.css'
import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.js'
import { addBackendTagToTitle } from './display.js'
import { currentTheme } from './storage.js'

window.addEventListener('DOMContentLoaded', async () => {
  addBackendTagToTitle()
  createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>)
  document.body.classList.add(await currentTheme())
})
