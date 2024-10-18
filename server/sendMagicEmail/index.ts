import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { azureWrap } from '../src/azureWrap'
import sendMagicEmail from '../src/endpoints/sendMagicEmail'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  await azureWrap(context, req, sendMagicEmail, { audit: true })
}

export default httpTrigger
