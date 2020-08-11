import { User, getFullUser } from './user'
import { Context, HttpRequest } from '@azure/functions'

/** This wraps an HTTP function and calls it with a hydrated authenticated user.
 * Returns true if execution should continue. */

export default async function authenticate(
  context: Context,
  req: HttpRequest,
  handler: (user: User) => void
) {
  const userId = req.headers && req.headers['x-ms-client-principal-id']
  if (!userId) {
    context.res = {
      status: 500,
      body: 'You did not include a user ID'
    }
    context.log('Failed to include a user ID')
    return
  }

  const user = await getFullUser(userId)
  return await handler(user)
}
