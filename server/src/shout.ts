import { User } from './user'
import DB from './cosmosdb'
import { Result } from './endpoint'

export async function shout (user: User, messageId: string, message: string): Promise<Result> {
  // Currently hardcode a 2-minute shout cooldown
  if (user.lastShouted) {
    const cooldownMinutes = 2
    const diff = new Date().valueOf() - user.lastShouted.valueOf()
    if (!user.isMod && Math.floor(diff / 1000 / 60) < cooldownMinutes) {
      return {
        httpResponse: {
          status: 200,
          body: {
            error:
            'Your voice is still hoarse from your last shout. Try again in a minute or two.'
          }
        }
      }
    }
  }

  await DB.userJustShouted(user)
  return {
    messages: [
      {
        target: 'shout',
        arguments: [messageId, user.id, message]
      }
    ],
    httpResponse: { status: 200 }
  }
}
