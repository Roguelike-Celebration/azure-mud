import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { authenticatedAzureWrap } from '../src/azureWrap'
import deleteRoomNote from '../src/endpoints/deleteRoomNote'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticatedAzureWrap(context, req, deleteRoomNote, { audit: true })
}

export default httpTrigger
