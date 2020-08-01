import React, { useState, useContext } from "react";
import { getMediaStream } from "../webRTC";
import { DispatchContext } from "../App";

interface Props {
  // The result of navigator.mediaDevices.enumerateDevices()
  devices: MediaDeviceInfo[];
}

export default function (props: Props) {
  const audioDevices = props.devices.filter((d) => d.kind === "audioinput");
  const videoDevices = props.devices.filter((d) => d.kind === "videoinput");
  const dispatch = useContext(DispatchContext);

  const deviceToOption = (d: MediaDeviceInfo) => {
    return (
      <option value={d.deviceId} key={d.deviceId}>
        {d.label}
      </option>
    )
  };

  const onVideoChange = (e) => {
    getMediaStream(dispatch, { videoId: e.target.value });
  };

  const onAudioChange = (e) => {
    getMediaStream(dispatch, { audioId: e.target.value });
  };

  return (
    <div>
      <select name="Video" id="video-select" onChange={onVideoChange}>
        {videoDevices.map(deviceToOption)}
      </select>
      <select name="Audio" id="audio-select" onChange={onAudioChange}>
        {audioDevices.map(deviceToOption)}
      </select>
    </div>
  );
}
