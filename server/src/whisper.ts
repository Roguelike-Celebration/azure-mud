import { Context } from '@azure/functions'

import { User, getUserIdForOnlineUsername, getUserIdForUsername } from './user'

export async function whisper (
  from: User,
  toUsername: string,
  message: string,
  context: Context
) {
  const toUser = await getUserIdForUsername(toUsername)
  const toUserIsOnline = await getUserIdForOnlineUsername(toUsername)

  // TODO: Return this as metadata so the client can NameView the username
  // Also: I think maybe a 404 is a better error code? but we can worry about that later if at all.
  if (!toUser) {
    context.res = {
      status: 200,
      body: {
        error: `${toUsername} does not match any usernames! You may also get this if the username was previously correct, but the user has changed their name since.`
      }
    }
    return
  } else if (!toUserIsOnline) {
    context.res = {
      status: 200,
      body: {
        error: `${toUsername} is not online and will not receive your message.`
      }
    }
    return
  }

  context.bindings.signalRMessages = [
    {
      userId: toUser,
      target: 'whisper',
      arguments: [from.id, message]
    }
  ]

  context.res = {
    status: 200,
    body: {}
  }
}
