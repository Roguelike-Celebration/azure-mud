import { DB } from '../database'
import { EndpointFunction, LogFn } from '../endpoint'

const clientDeployedWebhook: EndpointFunction = async (inputs: any, log: LogFn) => {
  const inputtedKey = inputs.key
  const actualKey = (await DB.getServerSettings()).webhookDeployKey
  if (!inputtedKey || inputtedKey !== actualKey) {
    return {
      httpResponse: {
        status: 403
      }
    }
  }

  return {
    messages: [
      {
        target: 'clientDeployed',
        arguments: []
      }
    ]
  }
}

export default clientDeployedWebhook
