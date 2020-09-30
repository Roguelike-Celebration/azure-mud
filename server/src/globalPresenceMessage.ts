import DB from './redis'
import { roomData } from './rooms'

/** Fetches presence data for a set of rooms and returns a SignalR message
 * to broadcast current presence data to all users */
export async function globalPresenceMessage (roomIds: string[]) {
  const data: { [roomId: string]: string[] } = {}

  await Promise.all(
    roomIds.map(async (id) => {
      const occupants = await DB.roomOccupants(id)
      data[id] = occupants
    })
  )

  return {
    target: 'presenceData',
    arguments: [data]
  }
}

/** Fetches presence data for all rooms and returns a JSON object with all that data
 * Intended to only be used in `/connect` to seed the presence data
 */
export async function allPresenceData (): Promise<{
  [roomId: string]: string[];
}> {
  const data: { [roomId: string]: string[] } = {}

  await Promise.all(
    Object.keys(roomData).map(async (id) => {
      const occupants = await DB.roomOccupants(id)
      data[id] = occupants
    })
  )

  return data
}
