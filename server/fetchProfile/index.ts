import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { look } from '../src/look'

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  const userId = req.body && req.body.userId
  if (!userId) {
    context.res = {
      status: 200,
      body: { error: 'You did not include a userId to fetch' }
    }
    return
  }
  return await look(userId, context)
}

export default httpTrigger
