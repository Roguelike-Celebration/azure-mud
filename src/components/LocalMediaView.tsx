import React, { useState, useContext } from 'react'
import { FaCog, FaVolumeUp, FaVolumeMute, FaVideo, FaVideoSlash, FaUser } from 'react-icons/fa'

import { DispatchContext } from '../App'
import { ShowModalAction } from '../Actions'
import { Modal } from '../modals'
import { useMediaChatContext } from '../videochat/mediaChatContext'

interface Props {
  speaking: boolean
  hideUI?: boolean
}

export default function LocalMediaView (props: Props) {
  const dispatch = useContext(DispatchContext)
  const { localStreamView, setMicEnabled, setCameraEnabled, cameraEnabled, micEnabled } = useMediaChatContext()

  const onChangeVideo = (e) => {
    setCameraEnabled(!cameraEnabled)
  }

  const onChangeAudio = (e) => {
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
            onClick={onChangeVideo}
            className={`link-styled-button video-button ${
              cameraEnabled ? 'enabled' : 'disabled'
            }`}
            aria-label="Toggle Video"
          >
            {cameraEnabled ? <FaVideo /> : <FaVideoSlash />}
          </button>
          <button
            id="send-audio"
            onClick={onChangeAudio}
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
