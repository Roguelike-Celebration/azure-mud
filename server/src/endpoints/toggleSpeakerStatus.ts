import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { awardUserBadge, isSpeaker, minimizeUser, User } from '../user'
import { DB } from '../database'
import { UnlockableBadgeMap } from '../badges'

const toggleSpeakerStatus: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const userIdToToggle: string = inputs.userId
  const isForPastYear = inputs.year !== '2023'

  if (!userIdToToggle) {
    return {
      httpResponse: {
        status: 400,
        body: { error: 'You did not include a user to speaker/unspeaker' }
      }
    }
  }

  let toggledUser: User

  /* toggle past speaker */
  if (isForPastYear) {
    const pastSpeakerBadge = UnlockableBadgeMap['🎙️']

    const profile = await DB.getUser(userIdToToggle)

    if (profile.unlockedBadges.includes(pastSpeakerBadge)) {
      const remainingUnlockedBadges = profile.unlockedBadges.filter(badge => badge !== pastSpeakerBadge)
      toggledUser = await DB.setPartialUserProfile(userIdToToggle, { unlockedBadges: remainingUnlockedBadges })
    } else {
      toggledUser = await awardUserBadge(userIdToToggle, pastSpeakerBadge)
    }
  /* toggle current speaker */
  } else {
    if (await isSpeaker(userIdToToggle)) {
      log(`[MOD] Setting user ${userIdToToggle} to speaker=false`)
      toggledUser = await DB.setSpeakerStatus(userIdToToggle, false)
    } else {
      log(`[MOD] Setting user ${userIdToToggle} to speaker=true`)
      toggledUser = await DB.setSpeakerStatus(userIdToToggle, true)
    }
  }

  return {
    messages: [{
      target: 'usernameMap',
      arguments: [{ [userIdToToggle]: minimizeUser(toggledUser) }]
    }]
  }
}

export default toggleSpeakerStatus
