import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { authenticatedAzureWrap } from '../src/azureWrap'
import sendChatMessage from '../src/endpoints/sendChatMessage'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  await authenticatedAzureWrap(context, req, sendChatMessage, { audit: true })
}

export default httpTrigger
