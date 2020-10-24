import { getFullUser } from '../user'
import DB from '../redis'
import { getHeartbeatData } from '../heartbeat'
import { roomData } from '../rooms'
import { globalPresenceMessage } from '../globalPresenceMessage'
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

  const groupManagementTasks = []
  for (let i = 0; i < usersToRemove.length; i++) {
    const userId = usersToRemove[i]
    const user = await getFullUser(userId)

    await DB.removeOccupantFromRoom(user.roomId, userId)
    await DB.setUserAsInactive(userId)
    groupManagementTasks.push(
      {
        userId,
        groupName: user.roomId,
        action: 'remove'
      }
    )
  }

  if (usersToRemove.length > 0) {
    log(
      `Removing the following inactive users: ${usersToRemove.join(', ')}`
    )
  }

  // This is a hack because sometimes people, for unknown reasons, get removed from activeUsers but *not* room presences
  const roomIds = Object.values(roomData).map((r) => r.id)
  for (let i = 0; i < roomIds.length; i++) {
    const roomId = roomIds[i]
    const occupantIds = await DB.roomOccupants(roomIds[i])

    for (let j = 0; j < occupantIds.length; j++) {
      const occupantId = occupantIds[j]
      if (!activeUsers.includes(occupantId)) {
        log(`User ${occupantId} was in room ${roomId} but was not active; removing.`)

        await DB.removeOccupantFromRoom(roomId, occupantId)
        roomsTouched.add(roomId)
      }
    }
  }

  return {
    messages: [
      {
        target: 'ping',
        arguments: []
      },
      await globalPresenceMessage(Array.from(roomsTouched))
    ],
    groupManagementTasks
  }
}

export default heartbeat
