import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import authenticate from '../src/authenticate'
import { isMod, getFullUser, minimizeUser } from '../src/user'
import DB from '../src/redis'
import setUpRoomsForUser from '../src/setUpRoomsForUser'
import {
  addUserToRoomPresence,
  removeUserFromRoomPresence
} from '../src/roomPresence'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  return await authenticate(context, req, async (user) => {
    if (!isMod(user.id)) {
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
        groupName: 'users',
        target: 'modDeleteMessage',
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
