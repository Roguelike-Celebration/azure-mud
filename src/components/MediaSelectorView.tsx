/* eslint-disable jsx-a11y/no-onchange */
import React, { useState, useContext, useEffect } from 'react'
import { DispatchContext } from '../App'
import { P2PWaitingForConnectionsAction, HideModalAction, LocalMediaSelectedCameraAction, LocalMediaSelectedMicrophoneAction } from '../Actions'
import { startVideoChat } from '../networking'
import LocalMediaView from './LocalMediaView'
import { AudioDeviceInfo, CallClient, VideoDeviceInfo, VideoOptions } from '@azure/communication-calling'
import { AzureCommunicationUserCredential } from '@azure/communication-common'

interface Props {
  cameraDevices: VideoDeviceInfo[];
  microphoneDevices: AudioDeviceInfo[];

  initialVideoDeviceId?: string;
  initialAudioDeviceId?: string;

  acsToken?: string

  userIsSpeaking: boolean

  showJoinButton?: boolean
}

export default async function MediaSelectorView (props: Props) {
  const dispatch = useContext(DispatchContext)

  const [videoId, setVideoId] = useState('')
  const [audioId, setAudioId] = useState('')
  console.log(props.cameraDevices.map(c => c.name), props.microphoneDevices)
  const deviceToOption = (d: VideoDeviceInfo|AudioDeviceInfo) => {
    return (
      <option value={d.id} key={d.id}>
        {d.name}
      </option>
    )
  }

  useEffect(() => {
    const callClient = new CallClient()
    const tokenCredential = new AzureCommunicationUserCredential(props.acsToken)
    callClient.createCallAgent(tokenCredential).then(callAgent => {
      callClient.getDeviceManager().then(deviceManager => {
        // Set AV bundles
      })
    })
  }, [])
  // TODO: Construct this once

  // TODO: These audio/video changes immediately affect your outgoing stream.
  // Eventually, they shouldn't.
  const onVideoChange = (e) => {
    console.log('Changed')
    setVideoId(e.target.value)
    dispatch(LocalMediaSelectedCameraAction(e.target.id))
  }

  const onAudioChange = (e) => {
    setAudioId(e.target.value)
    dispatch(LocalMediaSelectedMicrophoneAction(e.target.id))
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
          {props.cameraDevices.map(deviceToOption)}
        </select>
        <br/>
        <label htmlFor="#audio-select">Audio</label>
        <select
          name="Audio"
          id="audio-select"
          onChange={onAudioChange}
        >
          {props.microphoneDevices.map(deviceToOption)}
        </select>
      </div>
      {props.showJoinButton
        ? <button id="join" onClick={clickJoin}>Join</button>
        : ''}
    </div>
  )
}
