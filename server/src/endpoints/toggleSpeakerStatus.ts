import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { awardUserBadge, isSpeaker, isSpeakerForYear, minimizeUser, User } from '../user'
import { DB } from '../database'
import { UnlockableBadgeMap } from '../badges'

const toggleSpeakerStatus: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const userIdToToggle: string = inputs.userId
  const year: string = inputs.year
  const thisYear: string = `${(new Date()).getFullYear()}`
  const isForPastYear = year !== thisYear

  if (!userIdToToggle) {
    return {
      httpResponse: {
        status: 400,
        body: { error: 'You did not include a user to speaker/unspeaker' }
      }
    }
  }

  let toggledUser: User

  // Set their database status (which will give them the special badge if current year)
  if (await isSpeakerForYear(userIdToToggle, year)) {
    log(`[MOD] Setting user ${userIdToToggle} to speaker=false for ${year}`)
    toggledUser = await DB.setSpeakerStatus(userIdToToggle, year, false)
  } else {
    log(`[MOD] Setting user ${userIdToToggle} to speaker=true for ${year}`)
    toggledUser = await DB.setSpeakerStatus(userIdToToggle, year, true)
  }

  // Assign them the 'past speaker' badge
  // (We don't currently have per-year speakers, that would be a reasonable improvement)
  const pastSpeakerBadge = UnlockableBadgeMap['🎙️']

  const profile = await DB.getUser(userIdToToggle)

  if (profile.unlockedBadges.includes(pastSpeakerBadge)) {
    const remainingUnlockedBadges = profile.unlockedBadges.filter(badge => badge !== pastSpeakerBadge)
    toggledUser = await DB.setPartialUserProfile(userIdToToggle, { unlockedBadges: remainingUnlockedBadges })
  } else {
    toggledUser = await awardUserBadge(userIdToToggle, pastSpeakerBadge)
  }

  return {
    messages: [{
      target: 'usernameMap',
      arguments: [{ [userIdToToggle]: minimizeUser(toggledUser) }]
    }]
  }
}

export default toggleSpeakerStatus
