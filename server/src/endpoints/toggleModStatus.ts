import { DB } from '../database.js'
import { AuthenticatedEndpointFunction, LogFn } from '../endpoint.js'
import { getFullUser, getRequiredUser, isMod, minimizeUser, User } from '../user.js'

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
  const target = await getFullUser(userIdToToggle)
  if (!target) {
    return {
      httpResponse: {
        status: 404,
        body: { error: `User not found: id ${userIdToToggle}` }
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
  const toggledUser: User = await getRequiredUser(userIdToToggle)
  return {
    messages: [{
      target: 'usernameMap',
      arguments: [{ [userIdToToggle]: minimizeUser(toggledUser) }]
    }]
  }
}

export default toggleModStatus
