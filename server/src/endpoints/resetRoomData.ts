import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import Redis from '../redis'
import { Room } from '../rooms'
import roomData from '../rooms/data/roomData.json'
import { User } from '../user'

const resetRoomData: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  // TODO: Allow this to just wipe a specific room
  Object.values(roomData).forEach(room => {
    Redis.setRoomData(room as Room)
  })

  return {
    httpResponse: {
      status: 200,
      body: { roomData }
    }
  }
}

export default resetRoomData
