import { User } from './user'
import { Context } from '@azure/functions'
import DB from './redis'

export async function shout (user: User, messageId: string, message: string, context: Context) {
  // Currently hardcode a 2-minute shout cooldown
  if (user.lastShouted) {
    const cooldownMinutes = 2
    const diff = new Date().valueOf() - user.lastShouted.valueOf()
    if (Math.floor(diff / 1000 / 60) < cooldownMinutes) {
      context.res = {
        status: 200,
        body: {
          error:
            'Your voice is still hoarse from your last shout. Try again in a minute or two.'
        }
      }
      return
    }
  }

  await DB.userJustShouted(user.id)

  context.bindings.signalRMessages = [
    {
      target: 'shout',
      arguments: [messageId, user.id, message]
    }
  ]

  context.res = {
    status: 200,
    body: {}
  }
}
