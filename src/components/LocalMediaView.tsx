import React, { useContext } from 'react'
import { FaCog, FaUser, FaVideo, FaVideoSlash, FaVolumeMute, FaVolumeUp } from 'react-icons/fa'

import { ShowModalAction } from '../Actions.js'
import { DispatchContext } from '../App.js'
import { Modal } from '../modals.js'
import { useMediaChatContext } from '../videochat/mediaChatContext.js'

interface Props {
  speaking: boolean
  hideUI?: boolean
}

export default function LocalMediaView (props: Props) {
  const dispatch = useContext(DispatchContext)
  const { localStreamView, setMicEnabled, setCameraEnabled, cameraEnabled, micEnabled } = useMediaChatContext()

  const toggleVideo = () => {
    setCameraEnabled(!cameraEnabled)
  }

  const toggleAudio = () => {
    setMicEnabled(!micEnabled)
  }

  const showMediaSelector = () => {
    dispatch(ShowModalAction(Modal.MediaSelector))
  }

  if (!localStreamView) {
    return null
  }

  return (
    <div className="my-video">
      You
      {cameraEnabled ? (
        localStreamView
      ) : (
        <FaUser
          size={90}
          style={{ textAlign: 'center' }}
          className="placeholder-avatar"
        />
      )}
      {props.hideUI ? (
        ''
      ) : (
        <div>
          <button
            id="send-video"
            onClick={toggleVideo}
            className={`link-styled-button video-button ${
              cameraEnabled ? 'enabled' : 'disabled'
            }`}
            aria-label="Toggle Video"
          >
            {cameraEnabled ? <FaVideo /> : <FaVideoSlash />}
          </button>
          <button
            id="send-audio"
            onClick={toggleAudio}
            className={`link-styled-button video-button ${
              micEnabled ? 'enabled' : 'disabled'
            }`}
            aria-label="Toggle Audio"
          >
            {micEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
          </button>
          <button
            id="show-media-selector"
            onClick={showMediaSelector}
            className="link-styled-button video-button"
            aria-label="Show Media Selector"
          >
            <FaCog />
          </button>
        </div>
      )}
    </div>
  )
}
