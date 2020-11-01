import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import authenticate from '../src/authenticate'
import { authenticatedAzureWrap } from '../src/azureWrap'
import leaveVideoChat from '../src/endpoints/leaveVideoChat'
import DB from '../src/redis'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticatedAzureWrap(context, req, leaveVideoChat)
}

export default httpTrigger
