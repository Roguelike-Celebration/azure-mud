import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { authenticatedAzureWrap } from '../src/azureWrap'
import likeRoomNote from '../src/endpoints/roomNote/likeRoomNote'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticatedAzureWrap(context, req, likeRoomNote)
}

export default httpTrigger
