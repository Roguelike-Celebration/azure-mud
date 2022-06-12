import React, { useState } from 'react'
import { HappeningNowEntry, ServerSettings, toServerSettings } from '../../server/src/types'
import { resetRoomData, updateServerSettings } from '../networking'
import { Room } from '../room'

export default function ServerSettingsView (props: { serverSettings: ServerSettings, roomData: { [roomId: string]: Room } }) {
  const [newSettings, setNewSettings] = useState(JSON.stringify(props.serverSettings, null, 2))

  const [addHappeningNowText, setAddHappeningNowText] = useState('')
  const [addHappeningNowRoomId, setAddHappeningNowRoomId] = useState('')
  const [addHappeningNowExternalLink, setAddHappeningNowExternalLink] = useState('')

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

  const deleteHappeningNowEntry = (entry: HappeningNowEntry) => {
    const confirmation = confirm('Are you sure you want to delete the happening now note?')
    if (confirmation) {
      // Ugh I don't feel like googling more about how to work arrays, let's just do the dumb thing
      const settingsCopy: ServerSettings = JSON.parse(JSON.stringify(props.serverSettings))
      settingsCopy.happeningNowEntries = props.serverSettings.happeningNowEntries.filter((i) => i.text !== entry.text)
      updateServerSettings(settingsCopy)
    }
  }

  const addEntry = () => {
    if (addHappeningNowText.length === 0) {
      alert('You need to have text!')
      return
    } else if (addHappeningNowRoomId.length > 0 && addHappeningNowExternalLink.length > 0) {
      alert('You cannot have roomId and external link')
      return
    } else if (addHappeningNowRoomId.length > 0 && !props.roomData[addHappeningNowRoomId]) {
      alert('No such room as ' + addHappeningNowRoomId)
      return
    }

    const settingsCopy: ServerSettings = JSON.parse(JSON.stringify(props.serverSettings))
    settingsCopy.happeningNowEntries.push({
      text: addHappeningNowText,
      roomId: addHappeningNowRoomId.length > 0 ? addHappeningNowRoomId : undefined,
      externalLink: addHappeningNowExternalLink.length > 0 ? addHappeningNowExternalLink : undefined
    })
    updateServerSettings(settingsCopy)
  }

  const clickedResetRoomData = async () => {
    if (!confirm("Are you sure you'd like to reset room data?")) return
    await resetRoomData()
  }

  return (
    <div className='serverSettingsContainer'>
      <button onClick={clickedResetRoomData}>Reset Room Data</button>
      <h1>Happening Now Controls</h1>
      <h2>Current Entries</h2>
      {
        props.serverSettings.happeningNowEntries.map((e) => {
          return <li key={e.text}>
            {JSON.stringify(e)}
            <button id={'delete-' + e.text} onClick={() => deleteHappeningNowEntry(e)}>Delete</button>
          </li>
        })
      }
      <div className='form' id='addHappeningNowForm'>
        <div className="field">
          <label htmlFor="add-happening-now-text">Text</label>
          <input
            type="text"
            id="add-happening-now-text"
            value={addHappeningNowText}
            onChange={(e) => setAddHappeningNowText(e.currentTarget.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="add-happening-now-room-id">Room ID (blank if you want to link to an external site)</label>
          <input
            type="text"
            id="add-happening-now-room-id"
            value={addHappeningNowRoomId}
            onChange={(e) => setAddHappeningNowRoomId(e.currentTarget.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="add-happening-now-external-link">External Link (blank if you want to link to a room)</label>
          <input
            type="text"
            id="add-happening-now-external-link"
            value={addHappeningNowExternalLink}
            onChange={(e) => setAddHappeningNowExternalLink(e.currentTarget.value)}
          />
        </div>
        <button id='add-entry' onClick={addEntry} className='submit'>Add Entry</button>
      </div>

      <h1>Manual Controls (Finnicky)</h1>
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
