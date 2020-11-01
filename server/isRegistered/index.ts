import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { azureWrap } from '../src/azureWrap'
import isRegistered from '../src/endpoints/isRegistered'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await azureWrap(context, req, isRegistered, { userId: req.headers['x-ms-client-principal-id'] })
}

export default httpTrigger
