/* eslint-disable jsx-a11y/no-onchange */
import React, { useState, useContext } from 'react'
import { getMediaStream } from '../webRTC'
import { DispatchContext } from '../App'
import { P2PWaitingForConnectionsAction, HideModalAction } from '../Actions'
import { startVideoChat } from '../networking'
import LocalMediaView from './LocalMediaView'

interface Props {
  // The result of navigator.mediaDevices.enumerateDevices()
  devices: MediaDeviceInfo[];
  initialVideoDeviceId?: string;
  initialAudioDeviceId?: string;

  userIsSpeaking: boolean

  showJoinButton?: boolean
}

export default function MediaSelectorView (props: Props) {
  const audioDevices = props.devices.filter((d) => d.kind === 'audioinput')
  const videoDevices = props.devices.filter((d) => d.kind === 'videoinput')
  const dispatch = useContext(DispatchContext)

  const [videoId, setVideoId] = useState('')
  const [audioId, setAudioId] = useState('')

  const deviceToOption = (d: MediaDeviceInfo) => {
    return (
      <option value={d.deviceId} key={d.deviceId}>
        {d.label}
      </option>
    )
  }

  // TODO: These audio/video changes immediately affect your outgoing stream.
  // Eventually, they shouldn't.
  const onVideoChange = (e) => {
    console.log('Changed')
    setVideoId(e.target.value)
    getMediaStream(dispatch, { videoId: e.target.value, audioId })
  }

  const onAudioChange = (e) => {
    setAudioId(e.target.value)
    getMediaStream(dispatch, { videoId, audioId: e.target.value })
  }

  const clickJoin = () => {
    dispatch(HideModalAction())
    dispatch(P2PWaitingForConnectionsAction())
    startVideoChat()
  }

  return (
    <div id='media-selector'>
      <LocalMediaView speaking={props.userIsSpeaking} hideUI={true}/>
      <div className='selects'>
        <label htmlFor="#video-select">Webcam</label>
        <select
          name="Video"
          id="video-select"
          onChange={onVideoChange}
        >
          {videoDevices.map(deviceToOption)}
        </select>
        <br/>
        <label htmlFor="#audio-select">Audio</label>
        <select
          name="Audio"
          id="audio-select"
          onChange={onAudioChange}
        >
          {audioDevices.map(deviceToOption)}
        </select>
      </div>
      {props.showJoinButton
        ? <button id="join" onClick={clickJoin}>Join</button>
        : ''}
    </div>
  )
}
