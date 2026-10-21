import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/App'

window.addEventListener('DOMContentLoaded', async () => {
  ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
})
