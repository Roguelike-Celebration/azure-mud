import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import authenticate from '../src/authenticate'
import DB from '../src/redis'
import { globalPresenceMessage } from '../src/globalPresenceMessage'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  await authenticate(context, req, true, async (user) => {
    context.res = {
      status: 200
    }

    await DB.removeOccupantFromRoom(user.roomId, user.id)
    await DB.setUserAsInactive(user.id)

    context.bindings.signalRGroupActions = [
      {
        userId: user.id,
        groupName: user.roomId,
        action: 'remove'
      }
    ]

    context.bindings.signalRMessages = [
      {
        groupName: user.roomId,
        target: 'playerDisconnected',
        arguments: [user.id]
      },
      {
        target: 'videoPresence',
        arguments: [user.roomId, await DB.removeUserFromVideoPresence(user.id, user.roomId)]
      },
      await globalPresenceMessage([user.roomId])
    ]
  })
}

export default httpTrigger
