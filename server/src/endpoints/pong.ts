import { DB } from '../database.js'
import { AuthenticatedEndpointFunction, LogFn } from '../endpoint.js'
import { User } from '../user.js'

const pong: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  await DB.setUserHeartbeat(user)

  return { httpResponse: { status: 200 } }
}

export default pong
