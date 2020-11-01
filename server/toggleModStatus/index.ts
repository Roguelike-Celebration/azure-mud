import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { authenticatedAzureWrap } from '../src/azureWrap'
import toggleModStatus from '../src/endpoints/toggleModStatus'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticatedAzureWrap(context, req, toggleModStatus, { audit: true, mod: true })
}

export default httpTrigger
