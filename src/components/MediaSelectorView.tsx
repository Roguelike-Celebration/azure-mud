/* eslint-disable jsx-a11y/no-onchange */
import React, { useContext } from 'react'
import { DispatchContext } from '../App'
import { P2PWaitingForConnectionsAction, HideModalAction } from '../Actions'
import { startVideoChat } from '../networking'
import LocalMediaView from './LocalMediaView'
import { useCallingContext } from '../acs/useCallingContext'
import { useUserCallSettingsContext } from '../acs/useUserCallSettings'
import { VideoDeviceInfo, AudioDeviceInfo } from '@azure/communication-calling'
import { useActiveCallContext } from '../acs/useActiveCallContext'

interface Props {
  initialVideoDeviceId?: string;
  initialAudioDeviceId?: string;

  acsToken?: string

  userIsSpeaking: boolean

  showJoinButton?: boolean
}

export default function MediaSelectorView (props: Props) {
  const dispatch = useContext(DispatchContext)
  const { micList, cameraList } = useCallingContext()
  const { setCurrentCamera, setCurrentMic, currentCamera, currentMic } = useUserCallSettingsContext()
  const { joinCall } = useActiveCallContext()
  console.log(micList, cameraList)

  const deviceToOption = (d: VideoDeviceInfo|AudioDeviceInfo) => {
    return (
      <option value={d.id} key={d.id}>
        {d.name}
      </option>
    )
  }

  // TODO: These audio/video changes immediately affect your outgoing stream.
  // Eventually, they shouldn't.
  const onVideoChange = (e) => {
    setCurrentCamera(cameraList.find(c => c.id === e.target.value))
  }

  const onAudioChange = (e) => {
    setCurrentMic(micList.find(m => m.id === e.target.value))
  }

  const clickJoin = () => {
    dispatch(HideModalAction())
    dispatch(P2PWaitingForConnectionsAction())
    startVideoChat()
    joinCall('b0720a25-7bd2-44f3-af6b-8e84328bdb58')
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
          defaultValue={currentCamera && currentCamera.id}
        >
          {cameraList.map(deviceToOption)}
        </select>
        <br/>
        <label htmlFor="#audio-select">Audio</label>
        <select
          name="Audio"
          id="audio-select"
          onChange={onAudioChange}
          defaultValue={currentMic && currentMic.id}
        >
          {micList.map(deviceToOption)}
        </select>
      </div>
      {props.showJoinButton
        ? <button id="join" onClick={clickJoin}>Join</button>
        : ''}
    </div>
  )
}
