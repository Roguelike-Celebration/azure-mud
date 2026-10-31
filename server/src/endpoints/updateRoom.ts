import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import DB from '../redis'
import { User } from '../user'

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

  // Everything keys off the new data.id in the room data. The roomId input is the id selected when you
  // started editing. So if you change the id in the room definition, now it's a new room. That might be
  // intentional, so let it happen
  // Old versions of this code mistakenly added a data.roomId field with a copy of the input roomId here,
  // and that made it in to roomData.json. We no longer do that.
  if (roomId !== data.id) {
    log(`Room id changed on save: original id '${roomId}', new id '${data.id}'. Writing to '${data.id}'.`)
  }

  const room = await DB.setRoomData(data)

  return {
    httpResponse: {
      status: 200,
      body: { room }
    }
  }
}

export default updateRoom
