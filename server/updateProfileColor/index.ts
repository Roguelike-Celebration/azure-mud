import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { authenticatedAzureWrap } from '../src/azureWrap'
import updateProfileColor from '../src/endpoints/updateProfileColor'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedAzureWrap(context, req, updateProfileColor, { audit: true })
}

export default httpTrigger
