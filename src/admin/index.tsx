import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from './components/App'

window.addEventListener('DOMContentLoaded', async () => {
  ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
})
