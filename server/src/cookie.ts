import generators from '../src/generators/index.js'

import { Result } from './endpoint.js'
import { User } from './user.js'

export function cookie (user: User, messageId: string): Result {
  const generator = generators.fortuneCookies

  if (!generator) {
    return {
      httpResponse: {
        status: 400,
        body: { error: 'You included an invalid list: fortuneCookies' }
      }
    }
  }

  const fortune = generator.generate()
  const privateActionString = generator.actionString(fortune)

  return {
    messages: [
      {
        groupId: user.roomId,
        target: 'emote',
        arguments: [messageId, user.id, 'cracks open a fortune cookie.']
      },
      {
        userId: user.id,
        target: 'privateCommand',
        arguments: [privateActionString]
      }
    ]
  }
}
