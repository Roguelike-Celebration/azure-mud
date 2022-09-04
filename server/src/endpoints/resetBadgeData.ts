import { FreeBadges } from '../badges'
import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import DB from '../redis'
import { minimizeUser, User } from '../user'

const resetBadgeData: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  user.unlockedBadges = []
  user.equippedBadges = []
  await DB.setUserProfile(user.id, user)

  return {
    httpResponse: {
      status: 200,
      body: { unlockedBadges: FreeBadges, equippedBadges: [] }
    },
    messages: [{
      target: 'usernameMap',
      arguments: [{ [user.id]: minimizeUser(user) }]
    }]
  }
}

export default resetBadgeData
