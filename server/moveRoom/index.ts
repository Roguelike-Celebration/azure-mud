import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { authenticatedAzureWrap } from '../src/azureWrap.js'
import moveRoom from '../src/endpoints/moveRoom.js'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedAzureWrap(context, req, moveRoom)
}

export default httpTrigger
