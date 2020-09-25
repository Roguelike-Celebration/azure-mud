import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import authenticate from '../src/authenticate'
import { isMod } from '../src/user'

import DB from '../src/redis'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  return await authenticate(context, req, true, async (user) => {
    if (!(await isMod(user.id))) {
      context.res = {
        status: 403,
        body: { error: 'You are not a mod!' }
      }
      return
    }

    const spaceIsClosed = req.body && req.body.spaceIsClosed
    if (typeof spaceIsClosed === 'undefined') {
      context.res = {
        status: 400,
        body: { error: 'Explicitly specify whether the space should be open or not' }
      }
      return
    }

    // Coercing this to a bool makes sure nothing bad happens if clients pass in something unexpected
    await DB.setSpaceAvailability(!!spaceIsClosed)

    context.bindings.signalRMessages = [
      {
        target: 'spaceOpenedOrClosed',
        arguments: [spaceIsClosed]
      }
    ]

    context.res = { body: 200 }
  })
}

export default httpTrigger
