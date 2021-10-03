import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { azureWrap } from '../src/azureWrap'
import isRegistered from '../src/endpoints/isRegistered'
import { getUserIdFromHeaders } from '../src/authenticate'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const userId = await getUserIdFromHeaders(context, req)
  await azureWrap(context, req, isRegistered, { userId: userId })
}

export default httpTrigger
