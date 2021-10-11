/* eslint-disable jsx-a11y/no-onchange */
import React, { useContext, useEffect } from 'react'
import { DispatchContext } from '../App'
import { HideModalAction, StartVideoChatAction } from '../Actions'
import LocalMediaView from './LocalMediaView'
import { DeviceInfo, useMediaChatContext } from '../videochat/mediaChatContext'
import VideoAudioSettingsView from './VideoAudioSettingsView'

interface Props {
  initialVideoDeviceId?: string;
  initialAudioDeviceId?: string;

  userIsSpeaking: boolean

  roomId: string

  showJoinButton?: boolean
  hideVideo?: boolean
  keepCameraWhenMoving: boolean
}

export default function MediaSelectorView (props: Props) {
  const dispatch = useContext(DispatchContext)
  const { prepareMediaDevices, cameras, mics, currentMic, setCurrentMic, currentCamera, setCurrentCamera, publishMedia, publishAudio } = useMediaChatContext()

  useEffect(() => {
    const run = async () => {
      await prepareMediaDevices()
      console.log('Prepared for media chat')
    }
    run()

    /* Okay! So!
    * This is intended to make it so that when you close out the modal,
    * it turns off your webcam/mic (and webcam indicator light).
    * It... doesn't work, and I don't know why.
    * I also had a flag for whether the user explicitly clicked the 'join' button or not
    * (to not run this logic in that case, since we want to stay in the call)
    * and that didn't work either.
    * For that, I'm not sure what I don't understand about the relationship between
    * useState and these useEffect return blocks.
    *
    */
    // return () => {
    //   leaveCall()
    // }
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

    if (props.hideVideo) {
      publishAudio()
    } else {
      dispatch(StartVideoChatAction())
      publishMedia()
    }
  }

  let video
  if (!props.hideVideo) {
    video = (
      <><label htmlFor="#video-select">Webcam</label><select
        name="Video"
        id="video-select"
        onChange={onVideoChange}
        defaultValue={currentCamera && currentCamera.id}
      >
        {(cameras || []).map(deviceToOption)}
      </select><br /></>
    )
  }

  // HACK ALERT: Here because I couldn't figure out the CSS. Somebody who knows css please help, my code is dying. I
  // think it's in videoChat.css that this should be put.
  const mediaSelectorStyle = {
    display: 'flex',
    'flex-direction': 'column'
  }

  return (
    <div id='media-selector' style={mediaSelectorStyle}>
      <div>
        {props.hideVideo ? '' : <LocalMediaView speaking={props.userIsSpeaking} hideUI={true}/>}
        <div className='selects'>
          {video}
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
      </div>
      <div>
        <VideoAudioSettingsView keepCameraWhenMoving={props.keepCameraWhenMoving} />
      </div>
      {props.showJoinButton
        ? <button id="join" onClick={clickJoin}>Join</button>
        : ''}
    </div>
  )
}
