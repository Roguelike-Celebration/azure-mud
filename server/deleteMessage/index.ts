import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import authenticate from '../src/authenticate'
import { authenticatedAzureWrap } from '../src/azureWrap'
import deleteMessage from '../src/endpoints/deleteMessage'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedAzureWrap(context, req, deleteMessage, { audit: true, mod: true })
}

export default httpTrigger
