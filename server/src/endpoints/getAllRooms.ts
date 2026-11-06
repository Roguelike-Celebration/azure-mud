import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import DB from '../redis'
import { User } from '../user'
import type { RoomDataMap } from '../types'

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
