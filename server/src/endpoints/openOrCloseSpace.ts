import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'
import { User } from '../user'
import { DB } from '../database'

const openOrCloseSpace: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const spaceIsClosed = inputs.spaceIsClosed
  if (typeof spaceIsClosed === 'undefined') {
    return {
      httpResponse: {
        status: 400,
        body: { error: 'Explicitly specify whether the space should be open or not' }
      }
    }
  }

  // Coercing this to a bool makes sure nothing bad happens if clients pass in something unexpected
  await DB.setServerSettings({ spaceIsClosed: !!spaceIsClosed })

  return {
    messages: [
      {
        target: 'spaceOpenedOrClosed',
        arguments: [spaceIsClosed]
      }
    ],
    httpResponse: { status: 200 }
  }
}

export default openOrCloseSpace
