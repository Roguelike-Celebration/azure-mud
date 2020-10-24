import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { User, updateUserProfile, minimizeUser } from '../src/user'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const userId = req.headers && req.headers['x-ms-client-principal-id']
  if (!userId) {
    context.res = {
      status: 401,
      body: { registered: false, error: 'You are not logged in!' }
    }
  }

  const data: Partial<User> = req.body && req.body.user
  if (!data) {
    context.res = {
      status: 400,
      body: 'Include profile data!'
    }
    return
  }

  try {
    const profile = await updateUserProfile(userId, data)
    const minimalUser = minimizeUser(profile)

    context.bindings.signalRMessages = [{
      target: 'usernameMap',
      arguments: [{ [userId]: minimalUser }]
    }]

    // Special case audit log entry - see authenticate(...) for general case audit
    context.bindings.tableBinding = [{
      PartitionKey: userId,
      RowKey: Date.now().toString(),
      userId: userId,
      username: minimalUser.username,
      endpoint: req.url.replace('https://' + process.env.WEBSITE_HOSTNAME, ''),
      request: req.body
    }]

    // TODO: We'll likely eventually have some validation here
    context.res = {
      status: 200,
      body: { valid: true, user: profile }
    }
  } catch (e) {
    // Should be status 409
    // the client doesnt currently have a good way to handle non-200 status codes :(
    context.res = {
      status: 200,
      body: { valid: false, error: e.message }
    }
  }
}

export default httpTrigger
