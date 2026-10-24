import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { getUserIdFromHeaders } from '../src/authenticate.js'
import { azureWrap } from '../src/azureWrap.js'
import isRegistered from '../src/endpoints/isRegistered.js'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const userId = await getUserIdFromHeaders(context, req)
  await azureWrap(context, req, isRegistered, { userId: userId })
}

export default httpTrigger
