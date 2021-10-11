import React, { useContext, useEffect } from 'react'

import '../../style/profileEditView.css'
import { SetKeepCameraWhenMovingAction } from '../Actions'
import { DispatchContext } from '../App'
import { currentTheme, setTheme } from '../storage'
import VideoAudioSettingsView from './VideoAudioSettingsView'

interface Props {
  keepCameraWhenMoving: boolean;
}

export default function SettingsView (props: Props) {
  const dispatch = useContext(DispatchContext)

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

  const handleKeepCameraWhenMovingSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === 'true'
    dispatch(SetKeepCameraWhenMovingAction(newValue))
  }

  return (
    <div className='settingsContainer'>
      <div className='form' id="themeSelectionForm">
        <label htmlFor="themeSelectionForm">Select Theme:</label>
        <div className='radio'>
          <label>
            <input type = "radio"
              id = "theme"
              value = "default"
              checked = {selectedTheme === 'default'}
              onChange = {handleThemeSelection}
            />
            Default (Dark)
          </label>
        </div>
        <div className = "radio">
          <label>
            <input type = "radio"
              id = "theme"
              value = "solarized-dark"
              checked = {selectedTheme === 'solarized-dark'}
              onChange = {handleThemeSelection}
            />
            Solarized Dark
          </label>
        </div>
        <div className = "radio">
          <label>
            <input type = "radio"
              id = "theme"
              value = "solarized-light"
              checked = {selectedTheme === 'solarized-light'}
              onChange = {handleThemeSelection}
            />
            Solarized Light
          </label>
        </div>
      </div>
      <VideoAudioSettingsView keepCameraWhenMoving={props.keepCameraWhenMoving} />
    </div>
  )
}
