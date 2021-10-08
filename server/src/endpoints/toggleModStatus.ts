import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { isMod, minimizeUser, updateModStatus, User } from '../user'
import { DB } from '../database'

const toggleModStatus: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const userId = inputs.userId
  if (!userId) {
    return {
      httpResponse: {
        status: 400,
        body: { error: 'You did not include a user to mod/unmod' }
      }
    }
  }

  if (await isMod(userId)) {
    await DB.setModStatus(userId, false)
  } else {
    await DB.setModStatus(userId, true)
  }

  // Update mod status for everyone else
  return {
    messages: [{
      target: 'usernameMap',
      arguments: [{ [userId]: minimizeUser(user) }]
    }]
  }
}

export default toggleModStatus
