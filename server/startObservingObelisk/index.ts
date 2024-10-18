import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { authenticatedAzureWrap } from '../src/azureWrap'
import startObservingObelisk from '../src/endpoints/obelisk/startObservingObelisk'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticatedAzureWrap(context, req, startObservingObelisk)
}

export default httpTrigger
