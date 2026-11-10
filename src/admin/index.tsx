import React from 'react'
import { createRoot } from 'react-dom/client'

import { addBackendTagToTitle } from '../display.js'
import { currentTheme } from '../storage.js'

import App from './components/App.js'

window.addEventListener('DOMContentLoaded', async () => {
  addBackendTagToTitle()
  createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>)
  // Same theme as the main app, which has the setting. Won't apply to the editor widget,
  // but the preview pane will respect it, which is more important.
  document.body.classList.add(await currentTheme())
})
