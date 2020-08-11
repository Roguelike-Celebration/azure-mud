import { AzureFunction, Context, HttpRequest } from '@azure/functions'

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest,
  connectionInfo
): Promise<void> {
  context.res.json(connectionInfo)
}

export default httpTrigger
