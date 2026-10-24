import { FreeBadges } from '../badges.js'
import { AuthenticatedEndpointFunction, LogFn } from '../endpoint.js'
import DB from '../redis.js'
import { minimizeUser, User } from '../user.js'

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
