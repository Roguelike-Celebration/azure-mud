import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from './App'

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
  document.getElementById('body').classList.add(localStorage.getItem('UserSelectedTheme') || 'Default')
})
