import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import authenticate from '../src/authenticate'
import { isMod, getFullUser, minimizeUser, User } from '../src/user'
import DB from '../src/redis'
import setUpRoomsForUser from '../src/setUpRoomsForUser'
import {
  addUserToRoomPresence,
  removeUserFromRoomPresence
} from '../src/roomPresence'
import { globalPresenceMessage } from '../src/globalPresenceMessage'

// Copied and modified from disconnect/index.ts
async function disconnectAndBan(user: User, target: User, context: Context) {
  target.isBanned = true
  await DB.banUser(target.id)

  // Below is basically the code for disconnect but with additional SignalR Messages
  context.res = {
    status: 200
  }
  await removeUserFromRoomPresence(target.id, target.roomId)

  let activeUsers = await DB.getActiveUsers()
  if (activeUsers.includes(target.id)) {
    activeUsers = activeUsers.filter((u) => u !== target.id)
    await DB.setActiveUsers(activeUsers)
  }

  context.bindings.signalRGroupActions = [
    {
      userId: target.id,
      groupName: target.roomId,
      action: 'remove'
    }
  ]

  context.bindings.signalRMessages = [
    {
      groupName: target.roomId,
      target: 'playerBanned',
      arguments: [minimizeUser(target)]
    },
    // It is janky but fine that if the mod is in the same room as the target they get this twice
    {
      userId: user.id,
      target: 'playerBanned',
      arguments: [minimizeUser(target)]
    },
    {
      userId: target.id,
      target: 'playerBanned',
      arguments: [minimizeUser(target)]
    },
    // Disconnect logic
    {
      groupName: target.roomId,
      target: 'playerDisconnected',
      arguments: [target.id]
    },
    {
      target: 'videoPresence',
      arguments: [target.roomId, await DB.removeUserFromVideoPresence(target.id, target.roomId)]
    },
    await globalPresenceMessage([target.roomId])
  ]
}

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

    if (target.isMod) {
      context.res = {
        status: 403,
        body: { error: 'You cannot ban a mod!' }
      }
      return
    }

    if (target.isBanned) {
      target.isBanned = false
      await DB.unbanUser(targetId)
      context.bindings.signalRMessages = [
        {
          userId: user.id,
          target: 'playerUnbanned',
          arguments: [minimizeUser(target)]
        }
      ]
    } else {
      await disconnectAndBan(user, target, context)
    }

    context.res = {
      status: 200,
      body: {}
    }
  })
}

export default httpTrigger
