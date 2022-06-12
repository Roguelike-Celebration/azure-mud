import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import DB from '../redis'
import { User } from '../user'

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
