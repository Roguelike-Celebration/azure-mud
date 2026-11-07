import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { getUserIdFromHeaders } from '../src/authenticate.js'
import { azureWrap } from '../src/azureWrap.js'
import { DB } from '../src/database.js'
import updateProfile from '../src/endpoints/updateProfile.js'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const userId = await getUserIdFromHeaders(context, req)

  await azureWrap(context, req, updateProfile, { userId: userId })

  // We don't yet have an abstraction to do custom audit logs within our wrapped Azure functions
  // Adding a lil bit of business logic here is a quick fix for now.
  if (userId) {
    const username = (await DB.getUser(userId) || {}).username

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
