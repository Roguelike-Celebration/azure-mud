import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { authenticatedAzureWrap, azureWrap } from '../src/azureWrap'
import pong from '../src/endpoints/pong'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedAzureWrap(context, req, pong)
}

export default httpTrigger
