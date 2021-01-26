import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { azureWrap } from '../src/azureWrap'
import pong from '../src/endpoints/pong'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await azureWrap(context, req, pong, { userId: req.headers['x-ms-client-principal-id'] })
}

export default httpTrigger
