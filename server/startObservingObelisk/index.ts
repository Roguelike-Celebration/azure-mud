import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { authenticatedAzureWrap } from '../src/azureWrap.js'
import startObservingObelisk from '../src/endpoints/obelisk/startObservingObelisk.js'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticatedAzureWrap(context, req, startObservingObelisk)
}

export default httpTrigger
