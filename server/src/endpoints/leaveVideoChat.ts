import { DB } from '../database.js'
import { AuthenticatedEndpointFunction, LogFn } from '../endpoint.js'
import { User } from '../user.js'

// TODO: Fully remove this, as video chat is no longer supported and this should never be invoked on account of there
// being no way to enter video chat!
const leaveVideoChat: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  await DB.updateVideoPresenceForUser(user, false)
  return {
    messages: []
  }
}

export default leaveVideoChat
