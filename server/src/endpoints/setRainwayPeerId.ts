import { EndpointFunction, LogFn } from '../endpoint'

const setRainwayPeerId: EndpointFunction = async (inputs: any, log: LogFn) => {
  const peerId = inputs.peerId
  if (!peerId) {
    return {
      httpResponse: {
        status: 500,
        body: 'Include a peerId!'
      }
    }
  }
  return {
    messages: [
    {
      groupId: 'gamerCave', // TODO: Don't hardcode
      target: 'rainwayPeerId',
      arguments: [peerId]
    }
  ],
  httpResponse: { status: 200 }
}

export default setRainwayPeerId
