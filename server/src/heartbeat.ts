import { DB } from './database'
import { HeartbeatMap } from './types'
import { User } from './user'

/** All of these store heartbeats as Unix timestamps as numbers.
 * When I stored either a timestamp number or a ISO8601 string,
 * constructing a new Date() object was returning an invalid object.
 *
 * Since I'm just comparing Unix timestamps anyway, this is a lazy solution.
 */
export async function getHeartbeatData (): Promise<HeartbeatMap> {
  const activeUserIds: string[] = await DB.getActiveUsers()
  const data: HeartbeatMap = {}

  for (let i = 0; i < activeUserIds.length; i++) {
    const userId = activeUserIds[i]
    const date = await DB.getUserHeartbeat(userId)
    data[userId] = date
  }

  return data
}

export async function userHeartbeatReceived (user: User) {
  console.log(`userHeartbeatReceived. user = ${user.id}`)
  await DB.setUserHeartbeat(user)
  console.log(`Did setUserHeartbeat. user = ${user.id}`)
  await DB.setUserAsActive(user, true)
  console.log(`Did setAsActive. user = ${user.id}`)
}
