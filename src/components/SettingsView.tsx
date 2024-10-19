import React, { useContext, useEffect } from 'react'

import '../../style/profileEditView.css'
import { SetUseSimpleNamesAction } from '../Actions'
import { DispatchContext, SettingsContext } from '../App'
import { Badge } from '../../server/src/badges'

import { currentTheme, setTheme } from '../storage'

interface Props {
  unlockedBadges: Badge[];
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
        <div className="radio">
          <input
            type="radio"
            id="monochrome-amber"
            value="monochrome-amber"
            checked={selectedTheme === 'monochrome-amber'}
            onChange={handleThemeSelection}
          />
          <label htmlFor="monochrome-amber">Amber CRT</label>
        </div>
        <div className="radio">
          <input
            type="radio"
            id="monochrome-green"
            value="monochrome-green"
            checked={selectedTheme === 'monochrome-green'}
            onChange={handleThemeSelection}
          />
          <label htmlFor="monochrome-green">Green CRT</label>
        </div>
        <div className="radio">
          <input
            type="radio"
            id="vaporwave"
            value="vaporwave"
            checked={selectedTheme === 'vaporwave'}
            onChange={handleThemeSelection}
          />
          <label htmlFor="vaporwave">Vaporwave</label>
        </div>
        {props.unlockedBadges?.some(p => p.emoji === '🌭') &&
          <div className="radio">
            <input
              type="radio"
              id="hotdogstand"
              value="hotdogstand"
              checked={selectedTheme === 'hotdogstand'}
              onChange={handleThemeSelection}
            />
            <label htmlFor="hotdogstand">HotDog Stand</label>
          </div>
        }
        <div className="radio">
          <input
            type="radio"
            id="summer-camp"
            value="summer-camp"
            checked={selectedTheme === 'summer-camp'}
            onChange={handleThemeSelection}
          />
          <label htmlFor="summer-camp">Summer Camp</label>
        </div> <div className="radio">
          <input
            type="radio"
            id="summer-camp-dark"
            value="summer-camp-dark"
            checked={selectedTheme === 'summer-camp-dark'}
            onChange={handleThemeSelection}
          />
          <label htmlFor="summer-camp-dark">Summer Camp (Dark)</label>
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

      </div>
    </div>
  )
}
