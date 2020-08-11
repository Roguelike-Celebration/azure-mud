import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import DB from '../src/redis'

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

  const user = await DB.getPublicUser(userId)

  context.res = {
    status: 200,
    body: { registered: user && user.username }
  }
}

export default httpTrigger
