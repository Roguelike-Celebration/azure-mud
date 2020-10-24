import { EndpointFunction, LogFn } from '../endpoint'
import { minimizeUser, updateUserProfile, User } from '../user'

const updateProfile: EndpointFunction = async (inputs: any, log: LogFn) => {
  if (!inputs.userId) {
    return {
      httpResponse: {
        status: 401,
        body: { registered: false, error: 'You are not logged in!' }
      }
    }
  }

  const data: Partial<User> = inputs.user
  if (!data) {
    return {
      httpResponse: {
        status: 400,
        body: 'Include profile data!'
      }
    }
  }

  try {
    const profile = await updateUserProfile(inputs.userId, data)
    const minimalUser = minimizeUser(profile)

    return {
      messages: [{
        target: 'usernameMap',
        arguments: [{ [inputs.userId]: minimalUser }]
      }],
      httpResponse: {
        status: 200,
        body: { valid: true }
      }
    }
  } catch (e) {
    // Should be status 409
    // the client doesnt currently have a good way to handle non-200 status codes :(
    return {
      httpResponse: {
        status: 200,
        body: { valid: false, error: e.message }
      }
    }
  }
}

export default updateProfile
