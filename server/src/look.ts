import { Context } from '@azure/functions'
import DB from './redis'

export async function look(target: string, context: Context) {
  const profile = await DB.getPublicUser(target)

  context.res = {
    status: 200,
    body: { user: profile }
  }
}
