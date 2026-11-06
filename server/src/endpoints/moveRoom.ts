import { AuthenticatedEndpointFunction, LogFn } from '../endpoint.js'
import { moveToRoom } from '../moveToRoom.js'
import { User } from '../user.js'

const moveRoom: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const toId = inputs.to
  if (!toId) {
    return {
      httpResponse: {
        status: 400,
        body: 'Include a room ID!'
      }
    }
  }

  return await moveToRoom(user, toId)
}

export default moveRoom
