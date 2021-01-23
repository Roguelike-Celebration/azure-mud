import {
  Call,
  CallState,
  LocalVideoStream,
  RemoteParticipant
} from '@azure/communication-calling'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useCallingContext } from './useCallingContext'
import { v4 as uuid } from 'uuid'
import { useUserCallSettingsContext } from './useUserCallSettings'
import { nie } from './utils'

type ActiveCallContextProps = {
  startCall: () => void;
  joinCall: (groupId: string) => void;
  leaveCall: () => void;
  call?: Call;
  remoteParticipants: RemoteParticipant[];
  localVideoStreams: LocalVideoStream[];
};

const ActiveCallContext = React.createContext<ActiveCallContextProps>({
  startCall: () => {
    throw new Error('Not implemented')
  },
  joinCall: nie,
  leaveCall: () => {
    throw new Error('Not implemented')
  },
  remoteParticipants: [],
  localVideoStreams: []
})

export const ActiveCallContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const { deviceManager, callAgent } = useCallingContext()
  const { currentCamera, currentMic, name } = useUserCallSettingsContext()
  const [call, setCall] = useState<Call>()
  const [, setCallState] = useState<CallState>()
  const [localVideoStreams, setLocalVideoStreams] = useState<
    LocalVideoStream[]
  >([])
  const [remoteParticipants, setRemoteParticipants] = useState<
    RemoteParticipant[]
  >([])

  const localVideoStreamsUpdated = useCallback(
    (streams: { added: LocalVideoStream[]; removed: LocalVideoStream[] }) => {
      setLocalVideoStreams(streams.added)
    },
    []
  )

  const remoteParticipantsUpdated = useCallback(
    (streams: { added: RemoteParticipant[]; removed: RemoteParticipant[] }) => {
      setRemoteParticipants(streams.added)
    },
    []
  )

  const callStateChanged = useCallback(() => {
    if (call) {
      setCallState(call.state)
    }
  }, [call])

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

  return (
    <ActiveCallContext.Provider
      value={{
        call,
        startCall: () => connectToCall(uuid()),
        joinCall: (groupId) => connectToCall(groupId),
        leaveCall: () => call.hangUp(),
        localVideoStreams,
        remoteParticipants
      }}
    >
      {props.children}
    </ActiveCallContext.Provider>
  )
}

export const useActiveCallContext = () => useContext(ActiveCallContext)
