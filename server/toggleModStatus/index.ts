import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { authenticatedAzureWrap } from '../src/azureWrap.js'
import toggleModStatus from '../src/endpoints/toggleModStatus.js'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticatedAzureWrap(context, req, toggleModStatus, { audit: true, mod: true })
}

export default httpTrigger
