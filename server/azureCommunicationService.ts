import { CallClient, LocalVideoStream } from '@azure/communication-calling'
import { AzureCommunicationUserCredential } from '@azure/communication-common'

export async function connectToAcsRoom (roomId: string, stream: MediaStream) {
  const userToken = '<user token>'
  const callClient = new CallClient()
  const tokenCredential = new AzureCommunicationUserCredential(userToken)
  const callAgent = await callClient.createCallAgent(tokenCredential, { displayName: 'optional ACS user name' })

  // TODO: Maybe replace manual stream code with this?
  // const deviceManager = await callClient.getDeviceManager()

  // TODO: How to construct this info?
  const localStream = new LocalVideoStream(stream)
  const placeCallOptions = { videoOptions: { localVideoStreams: [localStream] } }
  const groupOptions = { groupId: roomId }
  const call = callAgent.join(groupOptions, placeCallOptions)
}
