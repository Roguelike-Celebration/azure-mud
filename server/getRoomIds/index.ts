import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { authenticatedAzureWrap } from '../src/azureWrap.js'
import getRoomIds from '../src/endpoints/getRoomIds.js'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  // This doesn't *need* to be mod-only,
  // but as long as we're only calling it in the editor, why not
  await authenticatedAzureWrap(context, req, getRoomIds, { mod: true })
}

export default httpTrigger
