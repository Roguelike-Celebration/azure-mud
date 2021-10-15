import { User } from './user'
import { cookie } from '../src/cookie'
import { polymorph, cancellation } from '../src/polymorph'
import { Result } from './endpoint'

export async function interact (user: User, messageId: string, inspectedObject: string): Promise<Result> {
  if (user.roomId === 'oracle' && (inspectedObject.includes('cookie') || inspectedObject.includes('fortune'))) {
    return cookie(user, messageId)
  }
  if (user.roomId === 'bar') {
    if (inspectedObject.includes('potion')) {
      // Inspecting a potion
      if (inspectedObject.includes('colourful') || inspectedObject.includes('colorful') || inspectedObject.includes('coloured') || inspectedObject.includes('colored')) {
        return await polymorph(user, messageId)
      } else if (inspectedObject.includes('clear') || inspectedObject.includes('plain')) {
        return await cancellation(user, messageId)
      } else {
        return {
          httpResponse: {
            status: 200,
            body: { error: 'Sorry, I don\'t know a potion of that description.' }
          }
        }
      }
    }
  }
  return {
    httpResponse: {
      status: 200,
      body: { error: 'Sorry, that isn\'t an interactive object.' }
    }
  }
}
