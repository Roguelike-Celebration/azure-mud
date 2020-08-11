import { Context } from '@azure/functions'

import { User, getUserIdForUsername } from './user'

export async function whisper(
  from: User,
  toUsername: string,
  message: string,
  context: Context
) {
  const toUser = await getUserIdForUsername(toUsername)

  // TODO: Return this as metadata so the client can NameView the username
  if (!toUser) {
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
