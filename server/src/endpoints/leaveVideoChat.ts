import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { User } from '../user'
import { DB } from '../database'

// TODO: Fully remove this, as video chat is no longer supported and this should never be invoked on account of there
// being no way to enter video chat!
const leaveVideoChat: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const videoChatters = await DB.updateVideoPresenceForUser(user, false)

  return {
    messages: []
  }
}

export default leaveVideoChat
