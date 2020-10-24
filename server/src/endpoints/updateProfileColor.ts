import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { updateUserProfileColor, User } from '../user'
import { ValidColors } from '../types'

const updateProfileColor: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const color = inputs.color
  if (color && !(color in ValidColors)) {
    return {
      httpResponse: {
        status: 400,
        body: 'The color included is not a valid color!'
      }
    }
  }

  const profile = await updateUserProfileColor(user.id, color)

  return {
    messages: [{
      target: 'usernameMap',
      arguments: [{ [user.id]: profile }]
    }]
  }
}

export default updateProfileColor
