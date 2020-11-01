import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { azureWrap } from '../src/azureWrap'
import updateProfile from '../src/endpoints/updateProfile'
import DB from '../src/redis'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await azureWrap(context, req, updateProfile, { userId: req.headers['x-ms-client-principal-id'] })

  // We don't yet have an abstraction to do custom audit logs within our wrapped Azure functions
  // Adding a lil bit of business logic here is a quick fix for now.
  if (req.headers && req.headers['x-ms-client-principal-id']) {
    const userId = req.headers['x-ms-client-principal-id']
    const username = await DB.getMinimalProfileForUser(userId)

    // Special case audit log entry - see authenticate(...) for general case audit
    context.bindings.tableBinding = [{
      PartitionKey: userId,
      RowKey: Date.now().toString(),
      userId: userId,
      username: username,
      endpoint: req.url.replace('https://' + process.env.WEBSITE_HOSTNAME, ''),
      request: req.body
    }]
  }
}

export default httpTrigger
