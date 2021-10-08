import { AuthenticatedEndpointFunction, LogFn, Message } from '../endpoint'
import { User } from '../user'
import { DB } from '../database'
import { globalPresenceMessage } from '../globalPresenceMessage'

const disconnect: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  await DB.setUserAsActive(user, false)

  return {
    groupManagementTasks: [{
      userId: user.id,
      groupId: user.roomId,
      action: 'remove'
    }],
    messages: [
      {
        groupId: user.roomId,
        target: 'playerDisconnected',
        arguments: [user.id]
      },
      {
        target: 'videoPresence',
        arguments: [user.roomId, await DB.updateVideoPresenceForUser(user, false)]
      },
      await globalPresenceMessage([user.roomId])
    ],
    httpResponse: {
      status: 200
    }
  }
}

export default disconnect
