import DB from './cosmosdb'
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
  const activeUsers: User[] = await DB.getActiveUsers()

  const data: { [userId: string]: number } = {}

  for (let i = 0; i < activeUsers.length; i++) {
    const user = activeUsers[i]
    const date = user.heartbeat
    data[user.id] = date
  }

  return data
}

export async function userHeartbeatReceived (user: User) {
  await DB.setUserHeartbeat(user)
  await DB.setUserAsActive(user, true)
}
