import { DB } from '../database'
import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { globalPresenceMessage } from '../globalPresenceMessage'
import { User } from '../user'

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
      await globalPresenceMessage([user.roomId])
    ],
    httpResponse: {
      status: 200
    }
  }
}

export default disconnect
