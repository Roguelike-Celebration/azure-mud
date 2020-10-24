import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { azureWrap } from '../src/azureWrap'
import clientDeployedWebhook from '../src/endpoints/clientDeployedWebhook'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await azureWrap(context, req, clientDeployedWebhook)
}

export default httpTrigger
