import { AuthenticatedEndpointFunction, LogFn } from '../endpoint.js'
import DB from '../redis.js'
import { User } from '../user.js'

const getRoomIds: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const roomId = inputs.roomId
  if (!roomId) {
    return {
      httpResponse: {
        status: 200,
        body: { error: 'You did not include a roomId to delete' }
      }
    }
  }

  const room = await DB.deleteRoomData(roomId)

  return {
    httpResponse: {
      status: 200,
      body: { room }
    }
  }
}

export default getRoomIds
