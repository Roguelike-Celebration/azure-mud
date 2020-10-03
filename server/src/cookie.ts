import { User } from './user'
import { Context } from '@azure/functions'
import generators from '../src/generators'

export function cookie (user: User, messageId: string, context: Context) {
  const generator = generators.fortuneCookies

  if (!generator) {
    context.res = {
      status: 400,
      body: { error: 'You included an invalid list: fortuneCookies' }
    }
    return
  }

  const fortune = generator.generate()
  const privateActionString = generator.actionString(fortune)

  context.bindings.signalRMessages = [
    {
      groupName: user.roomId,
      target: 'emote',
      arguments: [messageId, user.id, 'cracks open a fortune cookie.']
    },
    {
      groupName: user.id,
      target: 'privateCommand',
      arguments: [privateActionString]
    }
  ]
}
