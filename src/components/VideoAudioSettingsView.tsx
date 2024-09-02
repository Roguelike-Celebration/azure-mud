import React, { useContext, useEffect } from 'react'
import { SetKeepCameraWhenMovingAction } from '../Actions'
import { DispatchContext } from '../App'

interface Props {
  keepCameraWhenMoving: boolean;
}

export default function VideoAudioSettingsView (props: Props) {
  const dispatch = useContext(DispatchContext)

  const handleKeepCameraWhenMovingSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === 'true'
    dispatch(SetKeepCameraWhenMovingAction(newValue))
  }

  return (
    <div className="videoAudioSettingsContainer">
      <form className="form" id="video-audio-selection-form">
        <label htmlFor="video-audio-selection-form" className="form-header">
          Video/Audio Options:
        </label>
        <div className="radio">
          <input
            type="radio"
            id="keep-camera-when-moving"
            value="true"
            checked={props.keepCameraWhenMoving === true}
            onChange={handleKeepCameraWhenMovingSelection}
          />
          Keep video/audio status when moving rooms
        </div>
        <div className="radio">
          <input
            type="radio"
            id="keep-camera-when-moving"
            value="false"
            checked={props.keepCameraWhenMoving === false}
            onChange={handleKeepCameraWhenMovingSelection}
          />
          Always leave video/audio when moving rooms
        </div>
      </form>
    </div>
  )
}
