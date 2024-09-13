import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { authenticatedAzureWrap } from '../src/azureWrap'
import sendMagicEmail from '../src/endpoints/sendMagicEmail'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  context.log('In connect')
  await authenticatedAzureWrap(context, req, sendMagicEmail, { audit: true })
}

export default httpTrigger
