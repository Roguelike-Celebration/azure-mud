import { AuthenticatedEndpointFunction, LogFn } from '../endpoint.js'
import Redis from '../redis.js'
import roomData from '../rooms/data/roomData.json'
import { Room } from '../rooms/index.js'
import { User } from '../user.js'

const resetRoomData: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  // TODO: Allow this to just wipe a specific room

  // First, delete all current rooms
  const roomIds = await Redis.getRoomIds()
  await Promise.all(roomIds.map(Redis.deleteRoomData))

  // Then, add new data
  await Promise.all(Object.values(roomData).map(room => {
    return Redis.setRoomData(room as Room)
  }))

  return {
    httpResponse: {
      status: 200,
      body: { roomData }
    }
  }
}

export default resetRoomData
