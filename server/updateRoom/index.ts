import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { authenticatedAzureWrap } from '../src/azureWrap'
import updateRoom from '../src/endpoints/updateRoom'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  // This doesn't *need* to be mod-only,
  // but as long as we're only calling it in the editor, why not
  await authenticatedAzureWrap(context, req, updateRoom, { mod: true })
}

export default httpTrigger
