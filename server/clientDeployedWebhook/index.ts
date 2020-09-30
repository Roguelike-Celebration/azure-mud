import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import DB from '../src/redis'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const inputtedKey = req.body && req.body.key
  const actualKey = await DB.webhookDeployKey()
  context.log(inputtedKey, actualKey)
  if (!inputtedKey || inputtedKey !== actualKey) {
    context.res = {
      status: 403
    }
    return
  }

  context.bindings.signalRMessages = [
    {
      target: 'clientDeployed',
      arguments: []
    }
  ]
  context.res = {}
}

export default httpTrigger
