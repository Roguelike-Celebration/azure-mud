import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { updateUserProfileColor } from '../src/user'
import authenticate from '../src/authenticate'
import logSignalR from '../src/logSignalR'
import { ValidColors } from '../src/types'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticate(context, req, true, async (user) => {
    const userId = req.body && req.body.userId
    if (!userId) {
      context.res = {
        status: 400,
        body: 'Include a valid userId!'
      }
      return
    } else if (userId != user.id) {
      context.res = {
        status: 401,
        body: 'You can only change your color!'
      }
    }

    const color = req.body && req.body.color
    if (!color) {
      context.res = {
        status: 400,
        body: 'Include a valid color!'
      }
      return
    } else if (!(color in ValidColors)) {
      context.res = {
        status: 400,
        body: 'The color included is not a valid color!'
      }
      return
    }

    const profile = await updateUserProfileColor(userId, color)

    context.bindings.signalRMessages = [{
      target: 'usernameMap',
      arguments: [{ [userId]: profile }]
    }]
  })
  logSignalR(context)
}

export default httpTrigger
