import { minimizeUser, updateUserProfile, User } from './user'
import { Context } from '@azure/functions'
import { cookie } from '../src/cookie'

const potionList = [
  '🐶', '🐕', '🐩', '🐕‍🦺', '🐺', '🦊', '🐰', '🐇', '🦝', '🐀', '🐅', '🐎', '🦄', '🦓', '🦌', '🐮', '🐷', '🐫', '🐭', '🐹', '🐇', '🦇', '🐿', '🐨', '🐻', '🐼', '🦦', '🦥', '🐌', '🦨', '🐣', '🐥', '🐔', '🦩', '🦉', ', 🕊', '🦜', '🦚', '🐸', '🐲', '🐬', '🐳', '🐙', '🦑', '🦈', '🐛', '🦋', '🐞', '🐝', '🦖', '🦕', '🦠', '🦀', '🦞', '🦐', '🌸', '🌺', '🌷', '🌱', '🌲', '🌴', '🌵', '🍁', '🍄', '🌝', '🌞', '☁', '⛄', '👾', '👻', '👹', '👺'
]

export async function interact (user: User, messageId: string, context: Context, inspectedObject: string) {
  if (user.roomId === 'kitchenTableC' && (inspectedObject.includes('cookie') || inspectedObject.includes('fortune'))) {
    cookie(user, messageId, context)
    return
  }
  if (user.roomId === 'bar') {
    if (inspectedObject.includes('potion')) {
      // Inspecting a potion
      let polymorph: string
      if (inspectedObject.includes('colourful') || inspectedObject.includes('colorful') || inspectedObject.includes('coloured') || inspectedObject.includes('colored')) {
        polymorph = potionList[Math.floor(Math.random() * potionList.length)]
      } else if (inspectedObject.includes('clear') || inspectedObject.includes('plain')) {
        polymorph = ''
      } else {
        context.res = {
          status: 200,
          body: { error: 'Sorry, I don\'t know a potion of that description.' }
        }
        return
      }
      const newProfile = await updateUserProfile(user.id, { polymorph })

      context.bindings.signalRMessages = [
        {
          groupName: user.roomId,
          target: 'emote',
          arguments: [messageId, user.id, 'quaffs a potion and changes form!']
        },
        {
          target: 'usernameMap',
          arguments: [{ [user.id]: minimizeUser(newProfile)}]
        }
      ]
      context.bindings.signalRMessages.unshift({
        userId: user.id,
        target: 'privateCommand',
        arguments: ["You feel like something has changed..."]
      })

      context.res = { status: 200 }
      return
    }
  }
  context.res = {
    status: 200,
    body: { error: 'Sorry, that isn\'t an interactive object.' }
  }
}
