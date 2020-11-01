import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { User } from '../user'
import DB from '../redis'

const leaveVideoChat: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const videoChatters = await DB.removeUserFromVideoPresence(user.id, user.roomId)

  return {
    messages: [
      {
        target: 'videoPresence',
        arguments: [user.roomId, videoChatters]
      }
    ]
  }
}

export default leaveVideoChat
