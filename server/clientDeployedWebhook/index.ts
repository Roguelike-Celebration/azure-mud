import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import DB from '../src/redis'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const key = req.body && req.body.key
  if (!key || key !== await DB.webhookDeployKey()) {
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
