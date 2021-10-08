import { getFullUser } from '../user'
import { DB } from '../database'
import { getHeartbeatData } from '../heartbeat'
import { EndpointFunction, LogFn } from '../endpoint'

const heartbeat: EndpointFunction = async (inputs: any, log: LogFn) => {
  const thresholdSeconds = 90

  var timeStamp = new Date().toISOString()

  log('Timer function ran!', timeStamp)

  const data = await getHeartbeatData()
  log('HEARTBEAT DATA', data)

  const now = new Date()
  const nowValue = now.valueOf()

  const activeUsers = []
  const usersToRemove = []
  Object.keys(data).forEach((user) => {
    const time = data[user]
    const diff = nowValue - time
    if (Math.floor(diff / 1000) > thresholdSeconds) {
      usersToRemove.push(user)
    } else {
      activeUsers.push(user)
    }
  })

  log(usersToRemove)

  const groupManagementTasks = []
  for (let i = 0; i < usersToRemove.length; i++) {
    log('Trying to index into usersToRemove', i)
    log(usersToRemove[i])
    const userId: string = usersToRemove[i]
    const user = await getFullUser(userId)
    log('Got user?', user)

    if (!user) continue

    await DB.setUserAsActive(user, false)
    log('Set user as inactive')
    groupManagementTasks.push(
      {
        userId,
        groupId: user.roomId,
        action: 'remove'
      }
    )
  }

  if (usersToRemove.length > 0) {
    log(
      `Removing the following inactive users: ${usersToRemove.join(', ')}`
    )
  }

  return {
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
