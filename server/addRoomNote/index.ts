import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { authenticatedAzureWrap } from '../src/azureWrap.js'
import addRoomNote from '../src/endpoints/roomNote/addRoomNote.js'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticatedAzureWrap(context, req, addRoomNote, { audit: true })
}

export default httpTrigger
