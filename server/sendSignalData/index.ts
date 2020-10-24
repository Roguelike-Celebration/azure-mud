import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { azureWrap } from '../src/azureWrap'
import sendSignalData from '../src/endpoints/sendSignalData'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await azureWrap(context, req, sendSignalData, { userId: req.headers['x-ms-client-principal-id'] })
}

export default httpTrigger
