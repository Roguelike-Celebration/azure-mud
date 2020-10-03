import { minimizeUser, updateUserProfile, User } from './user'
import { Context } from '@azure/functions'
import { cookie } from '../src/cookie'
import { polymorph, cancellation } from '../src/polymorph'

export async function interact (user: User, messageId: string, context: Context, inspectedObject: string) {
  if (user.roomId === 'kitchenTableC' && (inspectedObject.includes('cookie') || inspectedObject.includes('fortune'))) {
    cookie(user, messageId, context)
    return
  }
  if (user.roomId === 'bar') {
    if (inspectedObject.includes('potion')) {
      // Inspecting a potion
      if (inspectedObject.includes('colourful') || inspectedObject.includes('colorful') || inspectedObject.includes('coloured') || inspectedObject.includes('colored')) {
        return await polymorph(user, messageId, context)
      } else if (inspectedObject.includes('clear') || inspectedObject.includes('plain')) {
        return await cancellation(user, messageId, context)
      } else {
        context.res = {
          status: 200,
          body: { error: 'Sorry, I don\'t know a potion of that description.' }
        }
        return
      }
    }
  }
  context.res = {
    status: 200,
    body: { error: 'Sorry, that isn\'t an interactive object.' }
  }
}
