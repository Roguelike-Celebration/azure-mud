/* eslint-disable jsx-a11y/no-onchange */
import React, { useContext, useEffect } from 'react'
import { DispatchContext } from '../App'
import { P2PWaitingForConnectionsAction, HideModalAction } from '../Actions'
import { startVideoChat } from '../networking'
import LocalMediaView from './LocalMediaView'
import { DeviceInfo, useMediaChatContext } from '../videochat/mediaChatContext'

interface Props {
  initialVideoDeviceId?: string;
  initialAudioDeviceId?: string;

  userIsSpeaking: boolean

  roomId: string

  showJoinButton?: boolean
}

export default function MediaSelectorView (props: Props) {
  const dispatch = useContext(DispatchContext)
  const { prepareForMediaChat, cameras, mics, currentMic, setCurrentMic, currentCamera, setCurrentCamera, joinCall } = useMediaChatContext()

  useEffect(() => {
    const run = async () => {
      await prepareForMediaChat()
    }
    run()
  }, [])

  const deviceToOption = (d: DeviceInfo) => {
    return (
      <option value={d.id} key={d.id}>
        {d.name}
      </option>
    )
  }

  // TODO: These audio/video changes immediately affect your outgoing stream.
  // Eventually, they shouldn't.
  const onVideoChange = (e) => {
    setCurrentCamera(e.target.value)
  }

  const onAudioChange = (e) => {
    setCurrentMic(e.target.value)
  }

  const clickJoin = () => {
    dispatch(HideModalAction())
    dispatch(P2PWaitingForConnectionsAction())
    startVideoChat()
    joinCall(props.roomId)
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
          {(cameras || []).map(deviceToOption)}
        </select>
        <br/>
        <label htmlFor="#audio-select">Audio</label>
        <select
          name="Audio"
          id="audio-select"
          onChange={onAudioChange}
          defaultValue={currentMic && currentMic.id}
        >
          {(mics || []).map(deviceToOption)}
        </select>
      </div>
      {props.showJoinButton
        ? <button id="join" onClick={clickJoin}>Join</button>
        : ''}
    </div>
  )
}
