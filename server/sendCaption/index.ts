import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { authenticatedAzureWrap } from '../src/azureWrap'
import sendCaption from '../src/endpoints/sendCaption'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  await authenticatedAzureWrap(context, req, sendCaption, { audit: true })
}

export default httpTrigger
