import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { authenticatedAzureWrap } from '../src/azureWrap'
import equipBadgeFunction from '../src/endpoints/equipBadge'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  console.log('In equipBadge??')
  await authenticatedAzureWrap(context, req, equipBadgeFunction, { audit: true })
}

export default httpTrigger
