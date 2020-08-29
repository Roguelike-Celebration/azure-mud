import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import authenticate from '../src/authenticate'
import { isMod } from '../src/user'
import DB from '../src/redis'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticate(context, req, true, async (user) => {
    if (!(await isMod(user.id))) {
      context.res = {
        status: 403,
        body: { error: 'You are not a mod!' }
      }
      return
    }

    const userId = req.body && req.body.userId
    if (!userId) {
      context.res = {
        status: 400,
        body: { error: 'You did not include a user to ban/unban' }
      }
    }

    if (await isMod(userId)) {
      await DB.removeMod(userId)
    } else {
      await DB.addMod(userId)
    }

    // Update mod status for everyone else
    const minimalUser = await DB.getMinimalProfileForUser(userId)
    context.bindings.signalRMessages = [{
      target: 'usernameMap',
      arguments: [{ [userId]: minimalUser }]
    }]
  })
}

export default httpTrigger
