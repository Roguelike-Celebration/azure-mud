import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { User } from '../user'
import { DB } from '../database'

const leaveVideoChat: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const videoChatters = await DB.updateVideoPresenceForUser(user, false)

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
