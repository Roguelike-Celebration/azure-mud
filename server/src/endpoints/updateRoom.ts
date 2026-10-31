import { AuthenticatedEndpointFunction, LogFn } from '../endpoint.js'
import DB from '../redis.js'
import { User } from '../user.js'

const updateRoom: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const roomId = inputs.roomId
  const data = inputs.roomData
  if (!roomId) {
    return {
      httpResponse: {
        status: 200,
        body: { error: 'You did not include a roomId to update' }
      }
    }
  }

  if (!data) {
    return {
      httpResponse: {
        status: 200,
        body: { error: 'You did not include data' }
      }
    }
  }

  data.roomId = roomId
  const room = await DB.setRoomData(data)

  return {
    httpResponse: {
      status: 200,
      body: { room }
    }
  }
}

export default updateRoom
