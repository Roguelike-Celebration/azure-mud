import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import DB from '../src/redis'

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  const userId = req.headers && req.headers['x-ms-client-principal-id']
  if (!userId) {
    context.res = {
      status: 500,
      body: 'You did not include a user ID'
    }
  }

  await DB.setUserHeartbeat(userId)

  context.res = {
    status: 200,
    body: {}
  }
}

export default httpTrigger
