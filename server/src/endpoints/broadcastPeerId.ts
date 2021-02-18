import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { User } from '../user'
import DB from '../cosmosdb'

const broadcastPeerId: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  await DB.updateVideoPresenceForUser(user, true)
  const videoChatters = DB.getVideoPresenceForRoom(user.roomId)

  log('Broadcasting peer ID', user.roomId, user.id)
  return {
    messages: [
      {
        groupId: user.roomId,
        target: 'webrtcPeerId',
        arguments: [user.id]
      },
      {
        target: 'videoPresence',
        arguments: [user.roomId, videoChatters]
      }
    ]
  }
}
export default broadcastPeerId
