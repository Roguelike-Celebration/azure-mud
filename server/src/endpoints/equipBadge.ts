import { isNumber } from 'lodash'
import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { equipBadge, minimizeUser, User } from '../user'

const equipBadgeFunction: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const { badge, index } = inputs

  if (!isNumber(index)) {
    return {
      httpResponse: {
        status: 400,
        body: { error: "You didn't pass in an index!" }
      }
    }
  } else if (index < 0 || index > 1) {
    return {
      httpResponse: {
        status: 400,
        body: { error: 'Index must be 0 or 1!' }
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
