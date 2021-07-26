import {
  AudioDeviceInfo,
  Call,
  CallAgent,
  CallClient,
  CallState,
  DeviceManager,
  LocalVideoStream,
  RemoteParticipant,
  RemoteVideoStream,
  Renderer,
  VideoDeviceInfo
} from '@azure/communication-calling'
import { AzureCommunicationUserCredential } from '@azure/communication-common'
import { fetchAcsToken } from '../networking'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { MediaChatContext, Participant } from '../videochat/mediaChatContext'

/*
export const AcsChatContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [call, setCall] = useState<Call>()
  const [, setCallState] = useState<CallState>()
  const [, setClient] = useState<CallClient>()
  const [callAgent, setCallAgent] = useState<CallAgent>()
  const [deviceManager, setDeviceManager] = useState<DeviceManager>()
  const [cameraList, setCameraList] = useState<VideoDeviceInfo[]>()
  const [micList, setMicList] = useState<AudioDeviceInfo[]>()

  const [currentCamera, setCurrentCamera] = useState<VideoDeviceInfo>()
  const [currentMic, setCurrentMic] = useState<AudioDeviceInfo>()
  const [videoStream, setVidStream] = useState<LocalVideoStream>()
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [micEnabled, setMicEnabled] = useState(true)

  const [localVideoView, setLocalVideoView] = useState<React.ReactNode>(<AcsVideo />)

  const [localVideoStreams, setLocalVideoStreams] = useState<
    LocalVideoStream[]
  >([])
  const [remoteParticipants, setRemoteParticipants] = useState<
    RemoteParticipant[]
  >([])

  const [callParticipants, setCallParticipants] = useState<Participant[]>()

  const localVideoStreamsUpdated = useCallback(
    (streams: { added: LocalVideoStream[]; removed: LocalVideoStream[] }) => {
      setLocalVideoStreams(streams.added)
    },
    []
  )

  const remoteParticipantsUpdated = useCallback(
    (streams: { added: RemoteParticipant[]; removed: RemoteParticipant[] }) => {
      setRemoteParticipants(streams.added)

      const participants: Participant[] = streams.added.map((s) => {
        // TODO: Handle multiple streams
        return {
          userId: s.displayName, // TODO: May be wrong
          muted: false, // TODO
          streamView: <AcsVideo videoStream={s.videoStreams[0]} />,
          shouldShow: false // TODO: Threw this in to make this happy
        }
      })

      setCallParticipants(participants)
    },
    []
  )

  const callStateChanged = useCallback(() => {
    if (call) {
      setCallState(call.state)
    }
  }, [call])

  // Update video stream when local camera updates
  useEffect(() => {
    if (currentCamera && !videoStream) {
      const lvs = new LocalVideoStream(currentCamera)
      setVidStream(lvs)
      setLocalVideoView(<AcsVideo videoStream={lvs} />)
    } else if (
      currentCamera &&
      videoStream &&
      videoStream.getSource() !== currentCamera
    ) {
      videoStream.switchSource(currentCamera)
    }
  }, [currentCamera, videoStream])

  function connectToCall (groupId: string) {
    if (deviceManager && callAgent) {
      // callAgent.updateDisplayName(name)
      if (currentMic) {
        deviceManager.setMicrophone(currentMic)
      }

      const call = callAgent.join(
        { groupId },
        {
          videoOptions: {
            localVideoStreams: currentCamera
              ? [new LocalVideoStream(currentCamera)]
              : []
          }
        }
      )

      console.log('Joining call', groupId, currentCamera.id)

      setCall(call)

      call.on('localVideoStreamsUpdated', localVideoStreamsUpdated)
      call.on('remoteParticipantsUpdated', remoteParticipantsUpdated)
      call.on('callStateChanged', callStateChanged)
    } else {
      console.log('Failed on join', deviceManager, callAgent)
    }
  }

  useEffect(() => {
    return () => {
      if (call) {
        call.off('localVideoStreamsUpdated', localVideoStreamsUpdated)
        call.off('remoteParticipantsUpdated', remoteParticipantsUpdated)
        call.off('callStateChanged', callStateChanged)
      }
    }
  }, [
    call,
    localVideoStreamsUpdated,
    remoteParticipantsUpdated,
    callStateChanged
  ])

  async function prepareForMediaChat () {
    const callClient = new CallClient()
    setClient(callClient)

    const token = await fetchAcsToken()
    const tokenCredential = new AzureCommunicationUserCredential(token.token)
    let callAgent: CallAgent | undefined
    try {
      callAgent = await callClient.createCallAgent(tokenCredential)
      const deviceManager = await callClient.getDeviceManager()
      const result = await deviceManager.askDevicePermission(true, true)

      setCallAgent(callAgent)
      setDeviceManager(deviceManager)
      if (result.audio) {
        setMicList(deviceManager.getMicrophoneList())
      }

      if (result.video) {
        setCameraList(deviceManager.getCameraList())
      }
    } catch (e) {
      console.log('Catch', e)
      if (callAgent) {
        callAgent.dispose()
      }
    }
  }

  return (
    <MediaChatContext.Provider
      value={{
        prepareForMediaChat,

        // TODO: Map these to be generic DeviceInfo objects instead of ACS classes?
        cameras: cameraList,
        mics: micList,

        publishMedia: () => {},
        unpublishMedia: () => {},
        prepareMediaDevices: async () => {},

        currentMic,
        currentCamera,

        setCurrentCamera: (id: string) => setCurrentCamera(cameraList.find(c => c.id === id)),
        setCurrentMic: (id: string) => setCurrentMic(micList.find(c => c.id === id)),

        localStreamView: localVideoView,

        joinCall: (groupId) => connectToCall(groupId),
        leaveCall: () => call.hangUp(),

        callParticipants,

        micEnabled,
        setMicEnabled,

        cameraEnabled,
        setCameraEnabled
      }}
    >
      {props.children}
    </MediaChatContext.Provider>
  )
}

export function AcsVideo (props: {videoStream?: LocalVideoStream|RemoteVideoStream}) {
  const { videoStream } = props
  const vidRef = useRef<HTMLDivElement>(null)
  const [renderer, setRenderer] = useState<Renderer>()

  useEffect(() => {
    if (videoStream && !renderer) {
      setRenderer(new Renderer(videoStream))
    }
  }, [videoStream, renderer])

  useEffect(() => {
    if (renderer) {
      renderer.createView().then((view) => {
        vidRef.current!.appendChild(view.target)
      })
    }

    return () => {
      if (renderer) {
        renderer.dispose()
      }
    }
  }, [renderer, vidRef])

  return (
    <div ref={vidRef}></div>
  )
}

*/
