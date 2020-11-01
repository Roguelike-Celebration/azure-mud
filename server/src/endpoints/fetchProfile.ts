import { EndpointFunction, LogFn } from '../endpoint'
import DB from '../redis'
const fetchProfile: EndpointFunction = async (inputs: any, log: LogFn) => {
  const userId = inputs.userId
  if (!inputs.userId) {
    return {
      httpResponse: {
        status: 200,
        body: { error: 'You did not include a userId to fetch' }
      }
    }
  }

  const user = await DB.getPublicUser(inputs.userId)
  return {
    httpResponse: {
      status: 200,
      body: { user }
    }
  }
}

export default fetchProfile
