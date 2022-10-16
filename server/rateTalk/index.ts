import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { authenticatedAzureWrap } from '../src/azureWrap'
import rateTalk from '../src/endpoints/rateTalk'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  await authenticatedAzureWrap(context, req, rateTalk)
}

export default httpTrigger
