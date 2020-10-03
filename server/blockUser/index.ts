import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import authenticate from '../src/authenticate'
import { isMod, getFullUser, minimizeUser, User } from '../src/user'
import DB from '../src/redis'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  return await authenticate(context, req, true, async (user) => {
    if (!(await isMod(user.id))) {
      context.res = {
        status: 403,
        body: { error: 'You are not a mod!' }
      }
      return
    }

    const targetId = req.body && req.body.userId
    if (!targetId) {
      context.res = {
        status: 400,
        body: { error: 'You did not include a user to ban/unban' }
      }
      return
    }

    const target = await getFullUser(targetId)

    // Add user Ids to each block list, or remove
    // Send SignalR message to other person

    context.res = {
      status: 200,
      body: {}
    }
  })
}

export default httpTrigger
