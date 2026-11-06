import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { authenticatedAzureWrap } from '../src/azureWrap.js'
import deleteRoomNote from '../src/endpoints/roomNote/deleteRoomNote.js'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticatedAzureWrap(context, req, deleteRoomNote, { audit: true })
}

export default httpTrigger
