import { AzureFunction, Context } from '@azure/functions'
import { removeUserFromRoomPresence } from '../src/roomPresence'
import { getFullUser } from '../src/user'
import DB from '../src/redis'
import { getHeartbeatData } from '../src/heartbeat'

const timerTrigger: AzureFunction = async function (
  context: Context,
  myTimer: any
): Promise<void> {
  const thresholdSeconds = 90

  var timeStamp = new Date().toISOString()

  if (myTimer.IsPastDue) {
    context.log('Timer function is running late!')
  }
  context.log('Timer function ran!', timeStamp)

  const data = await getHeartbeatData()
  context.log('HEARTBEAT DATA', data)

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

  const signalRGroupActions = []
  for (let i = 0; i < usersToRemove.length; i++) {
    const userId = usersToRemove[i]
    const user = await getFullUser(userId)
    await removeUserFromRoomPresence(userId, user.roomId)
    signalRGroupActions.push(
      {
        userId,
        groupName: user.roomId,
        action: 'remove'
      }
    )
  }

  if (usersToRemove.length > 0) {
    context.log(
      `Removing the following inactive users: ${usersToRemove.join(', ')}`
    )
  }

  await DB.setActiveUsers(activeUsers)

  context.bindings.signalRGroupActions = signalRGroupActions
  context.bindings.signalRMessages = [
    {
      target: 'ping',
      arguments: []
    }
  ]
}

export default timerTrigger
