import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { authenticatedAzureWrap } from '../src/azureWrap'
import connect from '../src/endpoints/connect'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  context.log('In connect')
  await authenticatedAzureWrap(context, req, connect, { audit: true })
}

export default httpTrigger
