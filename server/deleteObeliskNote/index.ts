import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { authenticatedAzureWrap } from '../src/azureWrap.js'
import deleteObeliskNote from '../src/endpoints/obelisk/deleteObeliskNote.js'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticatedAzureWrap(context, req, deleteObeliskNote, { audit: true })
}

export default httpTrigger
