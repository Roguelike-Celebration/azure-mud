import { DB } from '../database'
import { EndpointFunction, LogFn } from '../endpoint'

const fetchProfile: EndpointFunction = async (inputs: any, log: LogFn) => {
  const userId = inputs.userId
  if (!userId) {
    return {
      httpResponse: {
        status: 200,
        body: { error: 'You did not include a userId to fetch' }
      }
    }
  }

  const user = await DB.getUser(userId)
  return {
    httpResponse: {
      status: 200,
      body: { user }
    }
  }
}

export default fetchProfile
