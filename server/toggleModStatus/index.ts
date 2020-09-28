import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import authenticate from '../src/authenticate'
import { isMod, updateModStatus } from '../src/user'
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
        body: { error: 'You did not include a user to mod/unmod' }
      }
    }

    if (await isMod(userId)) {
      await DB.removeMod(userId)
    } else {
      await DB.addMod(userId)
    }

    // addMod/removeMod only affect a DB list of all mods
    // We also need to update the user's full and minimal profiles
    // This is aching for a refactoring when it's not the week of the conf :)
    await updateModStatus(userId)

    // Update mod status for everyone else
    const minimalUser = await DB.getMinimalProfileForUser(userId)
    context.bindings.signalRMessages = [{
      target: 'usernameMap',
      arguments: [{ [userId]: minimalUser }]
    }]
  })
}

export default httpTrigger
