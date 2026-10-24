import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { authenticatedAzureWrap } from '../src/azureWrap.js'
import pong from '../src/endpoints/pong.js'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedAzureWrap(context, req, pong)
}

export default httpTrigger
