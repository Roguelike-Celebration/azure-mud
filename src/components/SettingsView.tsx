import React, { useContext, useEffect } from 'react'

import '../../style/profileEditView.css'
import { SetUseSimpleNamesAction, SetCaptionsEnabledAction } from '../Actions'
import { DispatchContext, SettingsContext } from '../App'

import { currentTheme, setTheme } from '../storage'
import VideoAudioSettingsView from './VideoAudioSettingsView'

interface Props {
  keepCameraWhenMoving: boolean;
  captionsEnabled: boolean;
}

export default function SettingsView (props: Props) {
  const dispatch = useContext(DispatchContext)
  const { useSimpleNames } = useContext(SettingsContext)

  // Set the selection of the radio group upon opening the modal
  const [selectedTheme, setSelectedTheme] = React.useState('default')

  useEffect(() => {
    (async () => {
      setSelectedTheme(await currentTheme())
    })()
  })

  // Handle what happens when you change the modal
  /// change the value in local storage
  /// then change the actual theme
  const handleThemeSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(selectedTheme, event.target.value)
    document.body.classList.replace(selectedTheme, event.target.value)
    setSelectedTheme(event.target.value)
    setTheme(event.target.value)
  }

  const handleSimpleNamesSelection = (simple: boolean) => {
    dispatch(SetUseSimpleNamesAction(simple))
  }

  const handleCaptionChoice = (e) => {
    if (e.target.value === 'captions-enabled') {
      dispatch(SetCaptionsEnabledAction(true))
    } else if (e.target.value === 'captions-disabled') {
      dispatch(SetCaptionsEnabledAction(false))
    }
  }

  return (
    <div className="settingsContainer">
      <div className="form" id="themeSelectionForm">
        <label htmlFor="themeSelectionForm" className="form-header">
          Select Theme:
        </label>
        <div className="radio">
          <input
            type="radio"
            id="default-theme"
            value="default"
            checked={selectedTheme === 'default'}
            onChange={handleThemeSelection}
          />
          <label htmlFor="default-theme">Default (Dark)</label>
        </div>
        <div className="radio">
          <input
            type="radio"
            id="solarized-dark"
            value="solarized-dark"
            checked={selectedTheme === 'solarized-dark'}
            onChange={handleThemeSelection}
          />
          <label htmlFor="solarized-dark">Solarized Dark</label>
        </div>
        <div className="radio">
          <input
            type="radio"
            id="solarized-light"
            value="solarized-light"
            checked={selectedTheme === 'solarized-light'}
            onChange={handleThemeSelection}
          />
          <label htmlFor="solarized-light">Solarized Light</label>
        </div>
      </div>
      <div className="form" id="simpleNamesSelectionForm">
        <label htmlFor="simpleNamesSelectionForm" className='form-header'>Username Display Mode:</label>
        <div className="radio">
          <label>
            <input
              type="radio"
              name="simpleNameSelection"
              id="useDefaultName"
              checked={!useSimpleNames}
              onChange={() => handleSimpleNamesSelection(false)}
            />
            Use Default Names (shows colors, fonts, and polymorph potion emojis)
          </label>
        </div>
        <div className="radio">
          <label>
            <input
              type="radio"
              name="simpleNameSelection"
              id="useSimpleName"
              checked={useSimpleNames}
              onChange={() => handleSimpleNamesSelection(true)}
            />
            Use Simple Names (text only)
          </label>
        </div>
      </div>
      <div className="form" id="captionsEnabled">
        <label
          htmlFor="captionsEnabled"
          className="form-header"
          style={{ marginBottom: 0 }}
        >
          Enable Captions (Experimental):
        </label>
        <span style={{ marginBottom: '1em' }}>
          This will automatically transcribe spoken audio as messages in the
          text chat.
        </span>
        <div className="radio">
          <input
            type="radio"
            id="captions-enabled"
            value="captions-enabled"
            checked={props.captionsEnabled}
            onChange={handleCaptionChoice}
          />
          <label htmlFor="captions-enabled">Enabled</label>
        </div>
        <div className="radio">
          <input
            type="radio"
            id="captions-disabled"
            value="captions-disabled"
            checked={!props.captionsEnabled}
            onChange={handleCaptionChoice}
          />
          <label htmlFor="captions-disabled">Disabled</label>
        </div>
      </div>
      <VideoAudioSettingsView
        keepCameraWhenMoving={props.keepCameraWhenMoving}
      />
    </div>
  )
}
