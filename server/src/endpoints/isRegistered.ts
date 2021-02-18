import { EndpointFunction, LogFn } from '../endpoint'
import DB from '../cosmosdb'

const isRegistered: EndpointFunction = async (inputs: any, log: LogFn) => {
  if (!inputs.userId) {
    return {
      httpResponse: {
        status: 401,
        body: { registered: false, error: 'You are not logged in!' }
      }
    }
  }

  log('Checking if user is registered', inputs.userId)

  const user = await DB.getPublicUser(inputs.userId)
  const spaceIsClosed = (await DB.getServerSettings()).spaceIsClosed

  log('Got user?', user)

  return {
    httpResponse: {
      status: 200,
      body: { registered: user && user.username, spaceIsClosed, isMod: user && user.isMod, isBanned: user && user.isBanned }
    }
  }
}

export default isRegistered
