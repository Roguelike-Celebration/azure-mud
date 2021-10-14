import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { isMod, minimizeUser, updateModStatus, User } from '../user'
import { DB } from '../database'

const toggleModStatus: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const userIdToToggle: string = inputs.userId
  if (!userIdToToggle) {
    return {
      httpResponse: {
        status: 400,
        body: { error: 'You did not include a user to mod/unmod' }
      }
    }
  }

  if (await isMod(userIdToToggle)) {
    log(`[MOD] Setting user ${userIdToToggle} to mod=false`)
    await DB.setModStatus(userIdToToggle, false)
  } else {
    log(`[MOD] Setting user ${userIdToToggle} to mod=true`)
    await DB.setModStatus(userIdToToggle, true)
  }

  // Update mod status for everyone else
  const toggledUser: User = await DB.getUser(userIdToToggle)
  return {
    messages: [{
      target: 'usernameMap',
      arguments: [{ [userIdToToggle]: minimizeUser(toggledUser) }]
    }]
  }
}

export default toggleModStatus
