import {
  AudioDeviceInfo,
  CallAgent,
  CallClient,
  DeviceManager,
  VideoDeviceInfo
} from '@azure/communication-calling'
import { AzureCommunicationUserCredential } from '@azure/communication-common'
import React, { useState, useEffect, useContext } from 'react'
import { fetchAcsToken } from '../networking'

export type CallingProps = {
  micList?: AudioDeviceInfo[];
  cameraList?: VideoDeviceInfo[];
  callAgent?: CallAgent;
  deviceManager?: DeviceManager;
};

const CallingContext = React.createContext<CallingProps>({})

export const CallingContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [, setClient] = useState<CallClient>()
  const [callAgent, setCallAgent] = useState<CallAgent>()
  const [deviceManager, setDeviceManager] = useState<DeviceManager>()
  const [cameraList, setCameraList] = useState<VideoDeviceInfo[]>()
  const [micList, setMicList] = useState<AudioDeviceInfo[]>()

  useEffect(() => {
    console.log('In useEffect')
    const run = async (callClient: CallClient) => {
      console.log('In run')
      const token = await fetchAcsToken()
      const tokenCredential = new AzureCommunicationUserCredential(token.token)
      let callAgent: CallAgent | undefined
      console.log('About to try')
      try {
        console.log('Creating devicemanager') // This is where we stop
        callAgent = await callClient.createCallAgent(tokenCredential)
        console.log('Created')
        const deviceManager = await callClient.getDeviceManager()
        const result = await deviceManager.askDevicePermission(true, true)

        setCallAgent(callAgent)
        setDeviceManager(deviceManager)
        console.log(result)
        if (result.audio) {
          setMicList(deviceManager.getMicrophoneList())
        }

        if (result.video) {
          console.log(deviceManager.getCameraList())

          setCameraList(deviceManager.getCameraList())
        }
      } catch (e) {
        console.log('Catch', e)
        if (callAgent) {
          callAgent.dispose()
        }
      }
    }

    const callClient = new CallClient()
    setClient(callClient)
    run(callClient)
  }, [])

  return (
    <CallingContext.Provider
      value={{
        cameraList,
        micList,
        callAgent,
        deviceManager
      }}
    >
      {props.children}
    </CallingContext.Provider>
  )
}

export const useCallingContext = () => useContext(CallingContext)
