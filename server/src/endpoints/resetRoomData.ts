import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import Redis from '../redis'
import roomData from '../rooms/compiled.json'
import { User } from '../user'

const resetRoomData: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
// TODO: Allow this to just wipe a specific room
  Object.values(roomData).forEach(room => {
    Redis.setRoomData(room)
  })

  return {
    httpResponse: {
      status: 200,
      body: { roomData }
    }
  }
}

export default resetRoomData
