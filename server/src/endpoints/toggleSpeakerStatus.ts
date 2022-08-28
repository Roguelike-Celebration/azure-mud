import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { isSpeaker, minimizeUser, User } from '../user'
import { DB } from '../database'

const toggleSpeakerStatus: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const userIdToToggle: string = inputs.userId
  if (!userIdToToggle) {
    return {
      httpResponse: {
        status: 400,
        body: { error: 'You did not include a user to speaker/unspeaker' }
      }
    }
  }

  if (await isSpeaker(userIdToToggle)) {
    log(`[MOD] Setting user ${userIdToToggle} to speaker=false`)
    await DB.setSpeakerStatus(userIdToToggle, false)
  } else {
    log(`[MOD] Setting user ${userIdToToggle} to speaker=true`)
    await DB.setSpeakerStatus(userIdToToggle, true)
  }

  // Update speaker status for everyone else
  const toggledUser: User = await DB.getUser(userIdToToggle)
  return {
    messages: [{
      target: 'usernameMap',
      arguments: [{ [userIdToToggle]: minimizeUser(toggledUser) }]
    }]
  }
}

export default toggleSpeakerStatus
