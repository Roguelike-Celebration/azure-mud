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

  // Here's a fun hack!
  // So, when opening a local MediaStream, we fetch the deviceIds for audio/video
  // so we can preselect the correct <select> items here
  //
  // However, Firefox does NOT support returning that data.
  // It can only give us the user-friendly label.
  // So, if the deviceId isn't found in our list, we try to match based on label and grab the Id.
  // The video and audio paths are identical.
  console.log(props)
  let defaultVideo = props.initialVideoDeviceId
  if (defaultVideo) {
    if (!videoDevices.find((v) => v.deviceId === defaultVideo)) {
      const foundByName = videoDevices.find((v) => v.label === defaultVideo)
      if (foundByName) {
        defaultVideo = foundByName.deviceId
        setVideoId(defaultVideo)
      } else {
        defaultVideo = undefined
      }
    }
  }

  let defaultAudio = props.initialAudioDeviceId
  if (defaultAudio) {
    if (!audioDevices.find((d) => d.deviceId === defaultAudio)) {
      const foundByName = audioDevices.find((d) => d.label === defaultAudio)
      if (foundByName) {
        defaultAudio = foundByName.deviceId
        setAudioId(defaultAudio)
      } else {
        defaultAudio = undefined
      }
    }
  }
  console.log(defaultAudio, defaultVideo)

  return (
    <div id='media-selector'>
      <LocalMediaView speaking={props.userIsSpeaking} hideUI={true}/>
      <div className='selects'>
        <label htmlFor="#video-select">Webcam</label>
        <select
          name="Video"
          id="video-select"
          onChange={onVideoChange}
          defaultValue={defaultVideo}
        >
          {videoDevices.map(deviceToOption)}
        </select>
        <br/>
        <label htmlFor="#audio-select">Audio</label>
        <select
          name="Audio"
          id="audio-select"
          onChange={onAudioChange}
          defaultValue={defaultAudio}
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
