import generators from '../src/generators'
import { Result } from './endpoint'
import { minimizeUser, updateUserProfile, User } from './user'

export async function polymorph (user: User, messageId: string): Promise<Result> {
  const generator = generators.polymorph

  if (!generator) {
    return {
      httpResponse: {
        status: 400,
        body: { error: 'You included an invalid list: polymorph' }
      }
    }
  }

  const actionText = generator.generate()
  const polymorph = generator.actionString(actionText)

  const newProfile = await updateUserProfile(user.id, { polymorph })

  return {
    messages: [
      {
        groupId: user.roomId,
        target: 'emote',
        arguments: [messageId, user.id, 'drinks a colourful potion and changes form!']
      },
      {
        userId: user.id,
        target: 'privateCommand',
        arguments: [actionText]
      },
      {
        target: 'usernameMap',
        arguments: [{ [user.id]: minimizeUser(newProfile) }]
      }
    ]
  }
}

export async function cancellation (user: User, messageId: string): Promise<Result> {
  const polymorph = ''
  const newProfile = await updateUserProfile(user.id, { polymorph })

  return {
    messages: [
      {
        groupId: user.roomId,
        target: 'emote',
        arguments: [messageId, user.id, 'drinks a clear potion and returns to normal.']
      },
      {
        userId: user.id,
        target: 'privateCommand',
        arguments: ['You quaff the clear potion and return to your usual self.']
      },
      {
        target: 'usernameMap',
        arguments: [{ [user.id]: minimizeUser(newProfile) }]
      }
    ]
  }
}
