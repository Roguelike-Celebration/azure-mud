import { EndpointFunction, LogFn } from '../endpoint'
import DB from '../redis'

const isRegistered: EndpointFunction = async (inputs: any, log: LogFn) => {
  if (!inputs.userId) {
    return {
      httpResponse: {
        status: 401,
        body: { registered: false, error: 'You are not logged in!' }
      }
    }
  }

  const user = await DB.getPublicUser(inputs.userId)
  const spaceIsClosed = await DB.isSpaceClosed()

  return {
    httpResponse: {
      status: 200,
      body: { registered: user && user.username, spaceIsClosed, isMod: user && user.isMod, isBanned: user && user.isBanned }
    }
  }
}

export default isRegistered
