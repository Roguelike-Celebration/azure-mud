import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import resetRoomData from '../src/endpoints/resetRoomData'
import { authenticatedAzureWrap } from '../src/azureWrap'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedAzureWrap(context, req, resetRoomData, { mod: true })
}

export default httpTrigger
