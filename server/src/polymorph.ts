import { Context } from '@azure/functions'
import generators from '../src/generators'
import { minimizeUser, updateUserProfile, User } from './user'

export async function polymorph (user: User, messageId: string, context: Context) {
  const generator = generators.polymorph

  if (!generator) {
    context.res = {
      status: 400,
      body: { error: 'You included an invalid list: polymorph' }
    }
    return
  }

  const actionText = generator.generate()
  const polymorph = generator.actionString(actionText)

  const newProfile = await updateUserProfile(user.id, { polymorph })

  context.bindings.signalRMessages = [
    {
      groupName: user.roomId,
      target: 'emote',
      arguments: [messageId, user.id, 'drinks a colourful potion and changes form!']
    },
    {
      groupName: user.roomId,
      target: 'privateCommand',
      arguments: [actionText]
    },
    {
      target: 'usernameMap',
      arguments: [{ [user.id]: minimizeUser(newProfile) }]
    }
  ]
}

export async function cancellation (user: User, messageId: string, context: Context) {
  const polymorph = ''
  const newProfile = await updateUserProfile(user.id, { polymorph })

  context.bindings.signalRMessages = [
    {
      groupName: user.roomId,
      target: 'emote',
      arguments: [messageId, user.id, 'drinks a clear potion and returns to normal.']
    },
    {
      groupName: user.roomId,
      target: 'privateCommand',
      arguments: ['You quaff the clear potion and return to your usual self.']
    },
    {
      target: 'usernameMap',
      arguments: [{ [user.id]: minimizeUser(newProfile) }]
    }
  ]
}
