import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import resetBadgeData from '../src/endpoints/resetBadgeData'
import { authenticatedAzureWrap } from '../src/azureWrap'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedAzureWrap(context, req, resetBadgeData, { mod: true })
}

export default httpTrigger
