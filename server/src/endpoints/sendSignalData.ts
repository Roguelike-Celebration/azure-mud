import { EndpointFunction, LogFn } from '../endpoint'

const sendSignalData: EndpointFunction = async (inputs: any, log: LogFn) => {
  if (!inputs.userId) {
    return {
      httpResponse: {
        status: 500,
        body: 'You did not include a user ID'
      }
    }
  }

  const { peerId, data } = inputs
  if (!peerId || !data) {
    return {
      httpResponse: {
        status: 400,
        body: 'You did not include a peer ID or data'
      }
    }
  }

  return {
    messages: [
      {
        userId: peerId,
        target: 'webrtcSignalData',
        arguments: [inputs.userId, data]
      }
    ]
  }
}

export default sendSignalData
