import { EndpointFunction, LogFn } from '../endpoint'
import DB from '../redis'

const pong: EndpointFunction = async (inputs: any, log: LogFn) => {
  if (!inputs.userId) {
    return {
      httpResponse: {
        status: 500,
        body: 'You did not include a user ID'
      }
    }
  }

  await DB.setUserHeartbeat(inputs.userId)

  return { httpResponse: { status: 200 } }
}

export default pong
