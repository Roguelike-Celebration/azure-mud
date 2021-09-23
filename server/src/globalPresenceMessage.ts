import { DB } from './database'
import { Message } from './endpoint'

/** Fetches presence data for a set of rooms and returns a SignalR message
 * to broadcast current presence data to all users */
export async function globalPresenceMessage (roomIds: string[]): Promise<Message> {
  // TODO: This could be written as a single DB query for all rooms, instead of n queries for n rooms
  // However, we currently call this primarily with 1 room, and only once with 2
  // so this optimization is relatively low-priority for now.

  const data: { [roomId: string]: string[] } = {}

  console.log(roomIds)
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
