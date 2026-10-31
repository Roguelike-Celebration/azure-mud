import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { authenticatedAzureWrap } from '../src/azureWrap.js'
import moveAllUsersToEntryway from '../src/endpoints/moveAllUsersToEntryway.js'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedAzureWrap(context, req, moveAllUsersToEntryway)
}

export default httpTrigger
