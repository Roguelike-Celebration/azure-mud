import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { authenticatedAzureWrap } from '../src/azureWrap'
import moveRoom from '../src/endpoints/moveRoom'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  await authenticatedAzureWrap(context, req, moveRoom)
}

export default httpTrigger
