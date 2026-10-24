import { DB } from '../database.js'
import { EndpointFunction, GroupManagementTask, LogFn } from '../endpoint.js'
import { getHeartbeatData } from '../heartbeat.js'
import { getFullUser } from '../user.js'

const heartbeat: EndpointFunction = async (inputs: any, log: LogFn) => {
  const thresholdSeconds = 90

  const timeStamp = new Date().toISOString()

  const data = await getHeartbeatData()

  const now = new Date()
  const nowValue = now.valueOf()

  const activeUsers: string[] = []
  const usersToRemove: string[] = []
  Object.keys(data).forEach((user) => {
    const time = data[user]
    // Treat an active user with no heartbeat record as stale, and remove them.
    if (time === undefined) {
      usersToRemove.push(user)
      return
    }
    const diff = nowValue - time
    if (Math.floor(diff / 1000) > thresholdSeconds) {
      usersToRemove.push(user)
    } else {
      activeUsers.push(user)
    }
  })

  log(`heartbeat: Updating data. Timestamp=${timeStamp}, ${activeUsers.length} active, ` +
    `${usersToRemove.length} to remove`)

  const groupManagementTasks: GroupManagementTask[] = []
  for (let i = 0; i < usersToRemove.length; i++) {
    const userId: string = usersToRemove[i]
    const user = await getFullUser(userId)

    if (!user) {
      log(`WARNING: heartbeat: removal requested for userId=${userId}, but could not find FullUser data`)
      continue
    }
    await DB.setUserAsActive(user, false)
    log(`heartbeat: Set user as inactive: userId=${userId}, username=${user.username}`)
    groupManagementTasks.push(
      {
        userId,
        groupId: user.roomId,
        action: 'remove'
      }
    )
  }

  if (usersToRemove.length > 0) {
    log(`heartbeat: Will remove inactive users from groups: ${usersToRemove.join(', ')}`)
  }

  return {
    // Maybe we should put the roomId in here, so that we can forcibly sync the user to rooms if the client has old or
    // bad data.
    messages: [
      {
        target: 'ping',
        arguments: []
      }
    ],
    groupManagementTasks
  }
}

export default heartbeat
