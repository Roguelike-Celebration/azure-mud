import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { authenticatedAzureWrap } from '../src/azureWrap.js'
import addObeliskNote from '../src/endpoints/obelisk/addObeliskNote.js'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticatedAzureWrap(context, req, addObeliskNote, { audit: true })
}

export default httpTrigger
