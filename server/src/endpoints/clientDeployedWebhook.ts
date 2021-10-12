import { EndpointFunction, LogFn } from '../endpoint'

const clientDeployedWebhook: EndpointFunction = async (inputs: any, log: LogFn) => {
  const inputtedKey = inputs.key
  const actualKey = process.env.DEPLOY_WEBHOOK_KEY
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
