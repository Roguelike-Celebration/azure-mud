import { minimizeUser, updateUserProfile, User } from './user'
import { Context } from '@azure/functions'
import { cookie } from '../src/cookie'

const potionList = [
  '🙈', '🙉', '🙊', '🐵', '🦍', '🦧', '🐶', '🐕', '🐩', '🐕‍🦺', '🐺', '🦊', '🐰', '🐇', '🦝', '🐀', '🐅', '🐎', '🦄', '🦓', '🦌', '🐮', '🐷', '🐫', '🐭', '🐹', '🐇', '🦇', '🐿', '🐨', '🐻', '🐼', '🦦', '🦥', '🐌', '🦨', '🐣', '🐥', '🐔', '🦩', '🦉', ', 🕊', '🦜', '🦚', '🐸', '🐲', '🐬', '🐳', '🐙', '🦑', '🦈', '🐛', '🦋', '🐞', '🐝', '🦖', '🦕', '🦠', '🦀', '🦞', '🦐', '🌸', '🌺', '🌷', '🌱', '🌲', '🌴', '🌵', '🍁', '🍄', '🌝', '🌞', '☁', '⛄', '👾', '👻', '👹', '👺'
]

export async function interact (user: User, messageId: string, context: Context, inspectedObject: string) {
  if (user.roomId === 'kitchen' && (inspectedObject.includes('cookie') || inspectedObject.includes('fortune'))) {
    cookie(user, messageId, context)
    return
  }
  context.res = {
    status: 200,
    body: { error: 'Sorry, that isn\'t an interactive object.' }
  }
}
