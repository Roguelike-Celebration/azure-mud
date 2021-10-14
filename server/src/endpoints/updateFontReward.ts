import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { updateUserFontReward, updateUserProfileColor, User } from '../user'
import { ValidFontRewards } from '../types'

const updateFontReward: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const font = inputs.font
  if (font && !(font in ValidFontRewards)) {
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
