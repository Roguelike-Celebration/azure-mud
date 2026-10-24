import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { authenticatedAzureWrap } from '../src/azureWrap.js'
import likeObeliskNote from '../src/endpoints/obelisk/likeObeliskNote.js'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticatedAzureWrap(context, req, likeObeliskNote)
}

export default httpTrigger
