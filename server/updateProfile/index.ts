import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { User, updateUserProfile } from '../src/user'

const httpTrigger: AzureFunction = async function(
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

  const twitterHandle =
    req.headers && req.headers['x-ms-client-principal-name']
  if (twitterHandle) {
    data.twitterHandle = twitterHandle
  }

  await updateUserProfile(userId, data)

  // TODO: We'll likely eventually have some validation here
  context.res = {
    status: 200,
    body: { valid: true }
  }
}

export default httpTrigger
