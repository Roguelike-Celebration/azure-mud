import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { authenticatedAzureWrap } from '../src/azureWrap.js'
import updateRoom from '../src/endpoints/updateRoom.js'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  // This doesn't *need* to be mod-only,
  // but as long as we're only calling it in the editor, why not
  await authenticatedAzureWrap(context, req, updateRoom, { mod: true })
}

export default httpTrigger
