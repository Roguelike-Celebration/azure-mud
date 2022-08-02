import { isNumber } from 'lodash'
import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { equipBadge, minimizeUser, User } from '../user'

const equipBadgeFunction: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const { badge, index } = inputs

  if (!badge || !isNumber(index)) {
    return {
      httpResponse: {
        status: 400,
        body: { error: "You didn't pass in a badge and index!" }
      }
    }
  }

  const newUser = await equipBadge(user.id, badge, index)
  return {
    messages: [{
      target: 'usernameMap',
      arguments: [{ [user.id]: minimizeUser(newUser) }]
    }],
    httpResponse: {
      status: 200,
      body: { badges: newUser.equippedBadges }
    }
  }
}

export default equipBadgeFunction
