import DB from './redis'

/** All of these store heartbeats as Unix timestamps as numbers.
 * When I stored either a timestamp number or a ISO8601 string,
 * constructing a new Date() object was returning an invalid object.
 *
 * Since I'm just compring Unix timestamps anyway, this is a lazy solution.
 */
export async function getHeartbeatData(): Promise<{
  [userId: string]: number;
}> {
  const activeUsers: string[] = await DB.getActiveUsers()

  const data: { [userId: string]: number } = {}

  const dates = await Promise.all(
    activeUsers.map(async (u) => await DB.getUserHeartbeat(u))
  )

  for (let i = 0; i < activeUsers.length; i++) {
    const user = activeUsers[i]
    const date = dates[i]
    data[user] = date
  }

  return data
}

export async function userHeartbeatReceived(userId: string) {
  await DB.setUserHeartbeat(userId)
  await DB.setUserAsActive(userId)
}
