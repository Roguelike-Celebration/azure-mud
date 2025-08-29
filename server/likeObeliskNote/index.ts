import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { authenticatedAzureWrap } from '../src/azureWrap'
import likeObeliskNote from '../src/endpoints/obelisk/likeObeliskNote'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticatedAzureWrap(context, req, likeObeliskNote)
}

export default httpTrigger
