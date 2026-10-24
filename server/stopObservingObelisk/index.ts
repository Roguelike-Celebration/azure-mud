import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { authenticatedAzureWrap } from '../src/azureWrap.js'
import stopObservingObelisk from '../src/endpoints/obelisk/stopObservingObelisk.js'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticatedAzureWrap(context, req, stopObservingObelisk)
}

export default httpTrigger
