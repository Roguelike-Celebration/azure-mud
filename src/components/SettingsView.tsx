import React, { useContext } from 'react'

import '../../style/profileEditView.css'
import { DispatchContext } from '../App'
import { HideModalAction } from '../Actions'

export default function SettingsView () {
  const dispatch = useContext(DispatchContext)

  const close = () => {
    dispatch(HideModalAction())
  }

  // By default, use the state in local storage
  // Otherwise, set the state in local storage to be Default

  // Set the selection of the radio group upon opening the modal
  const [selectedTheme, setSelectedTheme] = React.useState(
    localStorage.getItem('UserSelectedTheme') || 'default'
  )

  // Handle what happens when you change the modal
  /// change the value in local storage
  /// then change the actual theme

  const handleThemeSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(selectedTheme, event.target.value)
    document.body.classList.replace(selectedTheme, event.target.value)
    setSelectedTheme(event.target.value)
    localStorage.setItem('UserSelectedTheme', event.target.value)
  }

  const handleToggleMovement = (event: React.ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem('HideAllMovementMessages', JSON.stringify(event.target.checked))
  }

  const handleMovementSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      localStorage.setItem('HideMovementThreshold', event.target.value)
    }
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
      <div className='form' id='movementNotificationForm'>
        <label htmlFor='movementNotificationForm'>Movement Messages:</label>
        <div>
          <label>
            <input type='checkbox'
              id='hideMoveToggle'
              defaultChecked={JSON.parse(localStorage.getItem('HideAllMovementMessages'))}
              onChange={handleToggleMovement} />
              Hide all movement messages
          </label>
        </div>
        <div>
          <label>
            <input type='number'
              id='hideMoveThreshold'
              min='0'
              name='stuff'
              defaultValue={localStorage.getItem('HideMovementThreshold')}
              onChange={handleMovementSelection} />
            Hide if person count is over
          </label>
        </div>
      </div>
    </div>
  )
}
