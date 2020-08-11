import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import authenticate from '../src/authenticate'
import { isMod, getFullUser, minimizeUser } from '../src/user'
import DB from '../src/redis'
import setUpRoomsForUser from '../src/setUpRoomsForUser'
import {
  addUserToRoomPresence,
  removeUserFromRoomPresence
} from '../src/roomPresence'

const httpTrigger: AzureFunction = async function(
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

    const userId = req.body && req.body.userId
    if (!userId) {
      context.res = {
        status: 400,
        body: { error: 'You did not include a user to ban/unban' }
      }
      return
    }

    const target = await getFullUser(userId)

    if (target.isMod) {
      context.res = {
        status: 403,
        body: { error: 'You cannot ban a mod!' }
      }
      return
    }

    if (target.isBanned) {
      target.isBanned = false
      await DB.unbanUser(userId)
      await addUserToRoomPresence(target.id, target.roomId)
      context.bindings.signalRGroupActions = setUpRoomsForUser(
        target.id,
        target.roomId
      )
      context.bindings.signalRMessages = [
        {
          groupName: target.roomId,
          target: 'playerConnected',
          arguments: [minimizeUser(target)]
        },
        {
          userId: target.id,
          target: 'error',
          arguments: [
            'You have been unbanned and can interact with the space again. Please act appropriately.'
          ]
        }
      ]
    } else {
      await DB.banUser(userId)
      await removeUserFromRoomPresence(target.id, target.roomId)
      context.bindings.signalRGroupActions = setUpRoomsForUser(target.id)
      context.bindings.signalRMessages = [
        {
          groupName: target.roomId,
          target: 'playerDisconnected',
          arguments: [minimizeUser(target)]
        },
        {
          userId: target.id,
          target: 'error',
          arguments: ['You have been banned. ']
        }
      ]
    }

    context.res = {
      status: 200,
      body: {}
    }
  })
}

export default httpTrigger
