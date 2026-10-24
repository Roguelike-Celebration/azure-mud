import { AuthenticatedEndpointFunction, LogFn } from '../endpoint.js'
import DB from '../redis.js'
import { User } from '../user.js'

const getRoomIds: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const roomIds = await DB.getRoomIds()
  return {
    httpResponse: {
      status: 200,
      body: { roomIds }
    }
  }
}

export default getRoomIds
