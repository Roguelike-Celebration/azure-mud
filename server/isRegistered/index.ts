import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { azureWrap } from '../src/azureWrap'
import isRegistered from '../src/endpoints/isRegistered'
import { getUserIdFromHeaders } from '../src/authenticate'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await azureWrap(context, req, isRegistered, { userId: req.body.userId })
}

export default httpTrigger
