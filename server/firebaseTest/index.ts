import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import * as admin from 'firebase-admin'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  context.log('In Firebase')
  var clientIdToken = req.body.token

  context.res = {
    status: 200,
    body: {
      words: 'words words words',
      reqBody: req.body,
      reqFull: req
    }
  }
}

export default httpTrigger
