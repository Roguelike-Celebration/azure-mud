import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { authenticatedAzureWrap } from '../src/azureWrap.js'
import openOrCloseSpace from '../src/endpoints/openOrCloseSpace.js'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticatedAzureWrap(context, req, openOrCloseSpace, { audit: true, mod: true })
}

export default httpTrigger
