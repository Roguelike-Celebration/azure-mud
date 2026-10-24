import { AuthenticatedEndpointFunction, LogFn } from '../endpoint.js'
import DB from '../redis.js'
import type { RoomDataMap } from '../types.js'
import { User } from '../user.js'

const getRoomIds: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const roomIds = await DB.getRoomIds()
  const roomData: RoomDataMap = {}

  await Promise.all(roomIds.map(async (roomId) => {
    const room = await DB.getRoomData(roomId)
    roomData[roomId] = room
  }))
  return {
    httpResponse: {
      status: 200,
      body: { roomData }
    }
  }
}

export default getRoomIds
