import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { removeUserFromRoomPresence } from '../src/roomPresence'
import authenticate from '../src/authenticate'
import DB from '../src/redis'
import { globalPresenceMessage } from '../src/globalPresenceMessage'

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<any> {
  await authenticate(context, req, async (user) => {
    context.res = {
      status: 200
    }

    await removeUserFromRoomPresence(user.id, user.roomId)

    let activeUsers = await DB.getActiveUsers()
    if (activeUsers.includes(user.id)) {
      activeUsers = activeUsers.filter((u) => u !== user.id)
      await DB.setActiveUsers(activeUsers)
    }

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
