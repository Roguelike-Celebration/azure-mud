import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import * as admin from 'firebase-admin';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  context.log('In Firebase')
  context.res = {
    status: 500,
    body: 'Firebase! v: ' + admin.SDK_VERSION
  }
  return
}

export default httpTrigger
