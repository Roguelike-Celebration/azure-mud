import { DB } from './database'
import { User } from './user'

/** All of these store heartbeats as Unix timestamps as numbers.
 * When I stored either a timestamp number or a ISO8601 string,
 * constructing a new Date() object was returning an invalid object.
 *
 * Since I'm just compring Unix timestamps anyway, this is a lazy solution.
 */
export async function getHeartbeatData (): Promise<{
  [userId: string]: number;
}> {
  const activeUserIds: string[] = await DB.getActiveUsers()

  const allRoomOccupants: { [roomId: string]: string[] } = await DB.allRoomOccupants()
  const roomOccupantIds: string[] = Object.values(allRoomOccupants).reduce((a, b) => a.concat(b), [])

  const userIds: Set<string> = new Set<string>([...activeUserIds, ...roomOccupantIds])
  const data: { [userId: string]: number } = {}

  for (const userId of userIds) {
    const date = await DB.getUserHeartbeat(userId)
    data[userId] = date
  }

  return data
}

export async function userHeartbeatReceived (user: User) {
  console.log('userHeartbeatReceived')
  await DB.setUserHeartbeat(user)
  console.log('Did setUserHeartbeat')
  await DB.setUserAsActive(user, true)
  console.log('Did setAsActive')
}
