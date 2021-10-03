import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { azureWrap } from '../src/azureWrap'
import sendSignalData from '../src/endpoints/sendSignalData'
import { getUserIdFromHeaders } from '../src/authenticate'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  var userId = await getUserIdFromHeaders(context, req)
  await azureWrap(context, req, sendSignalData, { userId: userId })
}

export default httpTrigger
