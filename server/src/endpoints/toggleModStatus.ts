import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { isMod, updateModStatus, User } from '../user'
import DB from '../redis'

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
    await DB.removeMod(userId)
  } else {
    await DB.addMod(userId)
  }

  // addMod/removeMod only affect a DB list of all mods
  // We also need to update the user's full and minimal profiles
  // This is aching for a refactoring when it's not the week of the conf :)
  await updateModStatus(userId)

  // Update mod status for everyone else
  const minimalUser = await DB.getMinimalProfileForUser(userId)
  return {
    messages: [{
      target: 'usernameMap',
      arguments: [{ [userId]: minimalUser }]
    }]
  }
}

export default toggleModStatus
