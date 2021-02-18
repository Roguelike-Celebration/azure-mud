import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { authenticatedAzureWrap } from '../src/azureWrap'
import leaveVideoChat from '../src/endpoints/leaveVideoChat'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticatedAzureWrap(context, req, leaveVideoChat)
}

export default httpTrigger
