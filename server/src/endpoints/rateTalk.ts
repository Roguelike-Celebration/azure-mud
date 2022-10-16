import { DB } from '../database'
import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { User } from '../user'

const rateTalk: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const { talk, rating, text } = inputs
  if (!talk || !rating) {
    return {
      httpResponse: {
        status: 400,
        body: 'Include a talk title, a rating out of 5, and optionally some text'
      }
    }
  }

  const newUser = await DB.rateTalk(user, talk, rating, text)

  return {
    messages: [],
    httpResponse: { status: 200, body: newUser }
  }
}

export default rateTalk
