import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { ValidFontReward } from '../types'
import { updateUserFontReward, User } from '../user'

const updateFontReward: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const font = inputs.font
  if (font && !(font in ValidFontReward)) {
    return {
      httpResponse: {
        status: 400,
        body: 'The font reward included is not a valid font reward from our list!'
      }
    }
  }

  const profile = await updateUserFontReward(user.id, font)

  return {
    messages: [{
      target: 'usernameMap',
      arguments: [{ [user.id]: profile }]
    }]
  }
}

export default updateFontReward
