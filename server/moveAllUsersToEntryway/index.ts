import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { authenticatedAzureWrap } from '../src/azureWrap'
import moveAllUsersToEntryway from '../src/endpoints/moveAllUsersToEntryway'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  await authenticatedAzureWrap(context, req, moveAllUsersToEntryway)
}

export default httpTrigger
