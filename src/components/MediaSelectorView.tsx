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
  const { prepareMediaDevices, cameras, mics, currentMic, setCurrentMic, currentCamera, setCurrentCamera, publishMedia, publishAudio, publishingCamera, publishingMic, unpublishMedia } = useMediaChatContext()

  useEffect(() => {
    const run = async () => {
      // This should maybe some "hasSetUpDevices" flag in the context or whatever,
      // but checking for the existence of a device seems valid for now.
      if (!currentMic) {
        await prepareMediaDevices()
        console.log('Prepared for media chat')
      }
    }
    run()

    // This code contains an *extremely* cursed bug.
    // For some reason, unpublishMedia nondeterministically sometimes gets
    // called in a context where `localVideoTrack` isn't defined,
    // and thus we can't turn off the user's camera.
    // Rather than descend into madness, I'm hacking around that in other ways in some cases.
    // But leaving this in to help when it does.
    return () => {
      if (!publishingCamera || !publishingMic) {
        unpublishMedia()
      }
    }
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
      <button id="join" onClick={clickJoin}>Use These Devices</button>
    </div>
  )
}
