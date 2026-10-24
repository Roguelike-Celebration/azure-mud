import { AzureFunction, Context, HttpRequest } from '@azure/functions'

import { authenticatedAzureWrap } from '../src/azureWrap.js'
import toggleSpeakerStatus from '../src/endpoints/toggleSpeakerStatus.js'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticatedAzureWrap(context, req, toggleSpeakerStatus, { audit: true, mod: true })
}

export default httpTrigger
