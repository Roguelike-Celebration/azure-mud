import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { authenticatedAzureWrap } from '../src/azureWrap.js'
import connect from '../src/endpoints/connect.js'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log('In connect')
  await authenticatedAzureWrap(context, req, connect, { audit: true })
}

export default httpTrigger
