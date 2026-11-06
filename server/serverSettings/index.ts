import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { authenticatedAzureWrap, azureWrap } from '../src/azureWrap'
import { getServerSettings, postServerSettings } from '../src/endpoints/serverSettings'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  if (req.method === 'GET') {
    await azureWrap(context, req, getServerSettings)
  } else if (req.method === 'POST') {
    await authenticatedAzureWrap(context, req, postServerSettings, { mod: true })
  }
}

export default httpTrigger
