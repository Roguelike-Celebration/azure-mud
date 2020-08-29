import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import authenticate from '../src/authenticate'
import { isMod } from '../src/user'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  return await authenticate(context, req, true, async (user) => {
    if (!await isMod(user.id)) {
      context.res = {
        status: 403,
        body: { error: 'You are not a mod!' }
      }
      return
    }

    const messageId = req.body && req.body.messageId
    if (!messageId) {
      context.res = {
        status: 400,
        body: { error: 'You did not include a message to delete.' }
      }
      return
    }

    context.bindings.signalRMessages = [
      {
        target: 'deleteMessage',
        arguments: [user.id, messageId]
      }
    ]

    context.res = {
      status: 200,
      body: {}
    }
  })
}

export default httpTrigger
