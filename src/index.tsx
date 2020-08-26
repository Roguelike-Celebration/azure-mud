import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from './App'

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
  document.body.classList.add(localStorage.getItem('UserSelectedTheme') || 'default')
})
