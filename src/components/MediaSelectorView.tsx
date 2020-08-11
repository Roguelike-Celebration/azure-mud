import React, { useState, useContext } from 'react'
import { getMediaStream } from '../webRTC'
import { DispatchContext } from '../App'

interface Props {
  // The result of navigator.mediaDevices.enumerateDevices()
  devices: MediaDeviceInfo[];
  initialVideoDeviceId?: string;
  initialAudioDeviceId?: string;
}

export default function MediaSelectorView(props: Props) {
  const audioDevices = props.devices.filter((d) => d.kind === 'audioinput')
  const videoDevices = props.devices.filter((d) => d.kind === 'videoinput')
  const dispatch = useContext(DispatchContext)

  const deviceToOption = (d: MediaDeviceInfo) => {
    return (
      <option value={d.deviceId} key={d.deviceId}>
        {d.label}
      </option>
    )
  }

  const onVideoChange = (e) => {
    getMediaStream(dispatch, { videoId: e.target.value })
  }

  const onAudioChange = (e) => {
    getMediaStream(dispatch, { audioId: e.target.value })
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
      } else {
        defaultAudio = undefined
      }
    }
  }
  console.log(defaultAudio, defaultVideo)

  return (
    <div>
      <select
        name="Video"
        id="video-select"
        onBlur={onVideoChange}
        defaultValue={defaultVideo}
      >
        {videoDevices.map(deviceToOption)}
      </select>
      <select
        name="Audio"
        id="audio-select"
        onBlur={onAudioChange}
        defaultValue={defaultAudio}
      >
        {audioDevices.map(deviceToOption)}
      </select>
    </div>
  )
}
