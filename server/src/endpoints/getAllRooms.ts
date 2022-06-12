import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import DB from '../redis'
import { Room } from '../rooms'
import { User } from '../user'

const getRoomIds: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const roomIds = await DB.getRoomIds()
  const roomData: {[roomId: string]: Room} = {}

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
