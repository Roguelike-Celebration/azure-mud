import React, { useState } from "react";
import { ServerSettings, toServerSettings } from "../../server/src/types";
import { updateServerSettings } from "../networking";


export default function ServerSettingsView(props: { serverSettings: ServerSettings }) {
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
      <label id='old-settings-label'>Old settings:</label>
      <pre id='old-settings-pretty'>{JSON.stringify(props.serverSettings, null, 2)}</pre>
      <label id='new-settings-label'>New settings:</label>
      <div className='form' id="serverSettingsForm">
        <textarea id="new-settings-textarea"
          defaultValue={newSettings}
          cols={40}
          rows={40}
          onChange={(e) => setNewSettings(e.currentTarget.value)}
        />
        <button
          // shep: issue #45, double checking that spaces didn't sneak into handle.
          onClick={(e) => {
            submit()
          }}
          className="submit">
            Save Changes
        </button>
      </div>
    </div>
  )
}