import React, { useState, useContext } from 'react'
import { FaCog, FaVolumeUp, FaVolumeMute, FaVideo, FaVideoSlash } from 'react-icons/fa'

import { toggleVideo, toggleAudio } from '../webRTC'
import { AcsVideo } from './MediaChatView'
import { DispatchContext } from '../App'
import { ShowModalAction } from '../Actions'
import { Modal } from '../modals'
import { LocalVideoStream, VideoDeviceInfo } from '@azure/communication-calling'

interface Props {
  speaking: boolean
  hideUI?: boolean
  videoId: string
  cameraDevices: VideoDeviceInfo[]
}

export default function LocalMediaView (props: Props) {
  const dispatch = useContext(DispatchContext)
  const [sendVideo, setUseVideo] = useState(true)
  const [sendAudio, setUseAudio] = useState(true)

  const onChangeVideo = (e) => {
    toggleVideo(sendVideo)
    setUseVideo(!sendVideo)
  }

  const onChangeAudio = (e) => {
    toggleAudio(sendAudio)
    setUseAudio(!sendAudio)
  }

  const showMediaSelector = () => {
    dispatch(ShowModalAction(Modal.MediaSelector))
  }

  const video = props.cameraDevices.find(d => d.id === props.videoId)

  // TODO: Figure out how to thread through the stream ID

  return (
    <div className="my-video">
      You:
      <AcsVideo
        src={new LocalVideoStream(video)}
        // className={`self ${props.speaking ? 'speaking' : ''}`}
        // muted={true}
      />
      {props.hideUI ? '' : (
        <div>
          <button id='send-video' onClick={onChangeVideo} className={`link-styled-button video-button ${sendVideo ? 'enabled' : 'disabled'}`} aria-label='Toggle Video'>
            {sendVideo ? <FaVideo /> : <FaVideoSlash />}
          </button>
          <button id='send-audio' onClick={onChangeAudio} className={`link-styled-button video-button ${sendAudio ? 'enabled' : 'disabled'}`} aria-label='Toggle Audio'>
            {sendAudio ? <FaVolumeUp /> : <FaVolumeMute />}
          </button>
          <button id='show-media-selector' onClick={showMediaSelector} className='link-styled-button video-button' aria-label='Show Media Selector'>
            <FaCog />
          </button>
        </div>
      )}

    </div>
  )
}
