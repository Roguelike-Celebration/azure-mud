import React, { useState } from 'react'
import { ServerSettings, toServerSettings } from '../../server/src/types'
import { updateServerSettings } from '../networking'

export default function ServerSettingsView (props: { serverSettings: ServerSettings }) {
  const [newSettings, setNewSettings] = useState(JSON.stringify(props.serverSettings, null, 2))

  const submit = () => {
    let parsedNewSettings
    try {
      parsedNewSettings = toServerSettings(JSON.parse(newSettings))
    } catch (e) {
      alert('JSON parse error: ' + e.toString())
      return
    }

    if (!parsedNewSettings) {
      alert('New settings were valid json but had invalid properties, please check for typos!')
    } else {
      updateServerSettings(parsedNewSettings)
    }
  }

  return (
    <div className='serverSettingsContainer'>
      <h3 id='old-settings-header'>Old settings:</h3>
      <pre id='old-settings-pretty'>{JSON.stringify(props.serverSettings, null, 2)}</pre>
      <h3 id='new-settings-header'>New settings:</h3>
      <div className='form' id='serverSettingsForm'>
        <textarea id='new-settings-textarea'
          defaultValue={newSettings}
          cols={50}
          rows={30}
          onChange={(e) => setNewSettings(e.currentTarget.value)}
        />
        <button
          // shep: issue #45, double checking that spaces didn't sneak into handle.
          onClick={(e) => {
            submit()
          }}
          className='submit'>
            Save Changes
        </button>
      </div>
    </div>
  )
}
