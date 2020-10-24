import { User, getFullUser, isMod } from './user'
import { Context, HttpRequest } from '@azure/functions'
import { v4 as uuid } from 'uuid'

export interface AuthenticationOptions {
  audit?: boolean
  mod?: boolean
}

/** This wraps an HTTP function and calls it with a hydrated authenticated user.
 * Returns true if execution should continue. */

export default async function authenticate (
  context: Context,
  req: HttpRequest,
  options: AuthenticationOptions = {},
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

  if (options.audit && !context.bindingDefinitions.find(def => def.name === 'tableBinding')) {
    context.res = {
      status: 501,
      body: 'Action was selected for auditing, but audit was not properly set up; action blocked until auditing configured.'
    }
    context.log('Failed to configure audit endpoint with the proper tableBinding')
    return
  }

  const user = await getFullUser(userId)

  if (options.mod) {
    if (!(await isMod(user.id))) {
      context.res = {
        status: 403,
        body: { error: 'This action requires moderator privileges.' }
      }
      return
    }
  }

  if (user.isBanned) {
    context.res = {
      status: 401,
      body: 'You are banned!'
    }
    context.log('Banned user was blocked:', user.id, user.username)
    return
  }

  const handled = await handler(user)

  if (options.audit) {
    context.bindings.tableBinding = [{
      PartitionKey: user.id,
      RowKey: uuid(),
      // The object comes loaded with a Timestamp by default as well
      userId: user.id,
      username: user.username,
      endpoint: req.url.replace('https://' + process.env.WEBSITE_HOSTNAME, ''),
      request: req.body // Assumes that all the relevant information will be in the body and not in, like...headers, or something
    }]
  }

  return handled
}
