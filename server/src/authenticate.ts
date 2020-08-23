import { User, getFullUser } from './user'
import { Context, HttpRequest } from '@azure/functions'

/** This wraps an HTTP function and calls it with a hydrated authenticated user.
 * Returns true if execution should continue. */

export default async function authenticate (
  context: Context,
  req: HttpRequest,
  audit: boolean,
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
  if (audit && !context.bindingDefinitions.find(def => def.name === 'tableBinding')) {
    context.res = {
      status: 500,
      body: 'Action was selected for auditing, but audit was not properly set up; action blocked until auditing configured.'
    }
    context.log('Failed to configure audit endpoint with the proper tableBinding')
    return
  }

  const user = await getFullUser(userId)
  const handled = await handler(user)

  if (audit) {
    context.bindings.tableBinding = [{
      PartitionKey: user.id,
      RowKey: Date.now().toString(), // I suppose with an appropriately zealous bot and a lot of luck, you could hit this timing window
      url: req.url,
      request: req.body,
      response: context.res
    }]
  }

  return handled
}
