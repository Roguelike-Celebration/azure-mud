import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import authenticate from '../src/authenticate'
import DB from '../src/redis'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticate(context, req, async (user) => {
    const videoChatters = await DB.removeUserFromVideoPresence(user.id, user.roomId)

    context.bindings.signalRMessages = [
      {
        target: 'videoPresence',
        arguments: [user.roomId, videoChatters]
      }
    ]
  })
}

export default httpTrigger
