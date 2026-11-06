import { DB } from '../database'
import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { User } from '../user'

const pong: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  await DB.setUserHeartbeat(user)

  return { httpResponse: { status: 200 } }
}

export default pong
