import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { azureWrap } from '../src/azureWrap.js'
import fetchProfile from '../src/endpoints/fetchProfile.js'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await azureWrap(context, req, fetchProfile)
}

export default httpTrigger
