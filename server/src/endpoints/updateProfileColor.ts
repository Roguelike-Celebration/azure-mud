import { AuthenticatedEndpointFunction, LogFn } from '../endpoint.js'
import { ValidColor } from '../types.js'
import { updateUserProfileColor, User } from '../user.js'

const updateProfileColor: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const color = inputs.color
  if (color && !(color in ValidColor)) {
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
