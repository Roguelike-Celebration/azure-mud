import React from 'react'
import ReactDOM from 'react-dom'

import App from './App.js'
import { currentTheme } from './storage.js'

window.addEventListener('DOMContentLoaded', async () => {
  ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
  document.body.classList.add(await currentTheme())
})
