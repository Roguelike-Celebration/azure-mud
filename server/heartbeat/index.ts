import { AzureFunction, Context } from '@azure/functions'
import { removeUserFromRoomPresence } from '../src/roomPresence'
import { getFullUser } from '../src/user'
import DB from '../src/redis'
import { getHeartbeatData } from '../src/heartbeat'
import { roomData } from '../src/rooms'
import { globalPresenceMessage } from '../src/globalPresenceMessage'

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
  const roomsTouched = new Set<string>()
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
    roomsTouched.add(user.roomId)
  }

  if (usersToRemove.length > 0) {
    context.log(
      `Removing the following inactive users: ${usersToRemove.join(', ')}`
    )
  }

  await DB.setActiveUsers(activeUsers)

  // This is a hack because sometimes people, for unknown reasons, get removed from activeUsers but *not* room presences
  const roomIds = Object.values(roomData).map((r) => r.id)
  for (let i = 0; i < roomIds.length; i++) {
    const roomId = roomIds[i]
    const occupantIds = await DB.roomOccupants(roomIds[i])

    for (let j = 0; j < occupantIds.length; j++) {
      const occupantId = occupantIds[j]
      if (!activeUsers.includes(occupantId)) {
        context.log(`User ${occupantId} was in room ${roomId} but was not active; removing.`)

        await removeUserFromRoomPresence(occupantId, roomId)
        roomsTouched.add(roomId)
      }
    }
  }

  context.bindings.signalRGroupActions = signalRGroupActions
  context.bindings.signalRMessages = [
    {
      target: 'ping',
      arguments: []
    },
    await globalPresenceMessage(Array.from(roomsTouched))
  ]
}

export default timerTrigger
