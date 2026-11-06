import generators from '../src/generators/index.js'

import { Result } from './endpoint.js'
import { minimizeUser, updateUserProfile, User } from './user.js'

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
  const polymorphText = generator.actionString(actionText)

  const newProfile = await updateUserProfile(user.id, { polymorph: polymorphText })

  return {
    messages: [
      {
        groupId: user.roomId,
        target: 'emote',
        arguments: [messageId, user.id, 'has their material essence shifted!']
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
  const polymorphText = ''
  const newProfile = await updateUserProfile(user.id, { polymorph: polymorphText })

  return {
    messages: [
      {
        groupId: user.roomId,
        target: 'emote',
        arguments: [messageId, user.id, 'returns to their original essence.']
      },
      {
        userId: user.id,
        target: 'privateCommand',
        arguments: ['You return to your original essence.']
      },
      {
        target: 'usernameMap',
        arguments: [{ [user.id]: minimizeUser(newProfile) }]
      }
    ]
  }
}
