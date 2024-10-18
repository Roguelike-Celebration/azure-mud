import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { authenticatedAzureWrap } from '../src/azureWrap'
import stopObservingObelisk from '../src/endpoints/obelisk/stopObservingObelisk'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticatedAzureWrap(context, req, stopObservingObelisk)
}

export default httpTrigger
