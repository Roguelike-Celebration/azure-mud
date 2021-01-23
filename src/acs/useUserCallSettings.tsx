import {
  AudioDeviceInfo,
  LocalVideoStream,
  VideoDeviceInfo
} from '@azure/communication-calling'
import React, { useState, useEffect, useContext, createContext } from 'react'
import { nie } from './utils'

export type UserCallSettingsContextType = {
  setCurrentCamera: (camera?: VideoDeviceInfo) => void;
  setCurrentMic: (mic?: AudioDeviceInfo) => void;
  setName: (name: string) => void;
  setCameraEnabled: (enabled: boolean) => void;
  setMicEnabled: (enabled: boolean) => void;
  currentCamera?: VideoDeviceInfo;
  currentMic?: AudioDeviceInfo;
  videoStream?: LocalVideoStream;
  name: string;
  cameraEnabled: boolean;
  micEnabled: boolean;
};

const UserCallSettingsContext = createContext<UserCallSettingsContextType>({
  setCurrentCamera: nie,
  setCurrentMic: nie,
  setName: nie,
  setCameraEnabled: nie,
  setMicEnabled: nie,
  name: '',
  cameraEnabled: false,
  micEnabled: false
})

export const UserCallSettingsContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [currentCamera, setCurrentCamera] = useState<VideoDeviceInfo>()
  const [currentMic, setCurrentMic] = useState<AudioDeviceInfo>()
  const [videoStream, setVidStream] = useState<LocalVideoStream>()
  const [name, setName] = useState('')
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [micEnabled, setMicEnabled] = useState(true)

  useEffect(() => {
    if (currentCamera && !videoStream) {
      const lvs = new LocalVideoStream(currentCamera)
      setVidStream(lvs)
    } else if (
      currentCamera &&
      videoStream &&
      videoStream.getSource() !== currentCamera
    ) {
      videoStream.switchSource(currentCamera)
    }
  }, [currentCamera, videoStream])

  return (
    <UserCallSettingsContext.Provider
      value={{
        setCurrentCamera,
        setCurrentMic,
        currentCamera,
        currentMic,
        videoStream,
        setName,
        name,
        setCameraEnabled,
        cameraEnabled,
        setMicEnabled,
        micEnabled
      }}
    >
      {props.children}
    </UserCallSettingsContext.Provider>
  )
}

export const useUserCallSettingsContext = () =>
  useContext(UserCallSettingsContext)
