import { AzureFunction, Context, HttpRequest } from '@azure/functions'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const userId = req.headers && req.headers['x-ms-client-principal-id']

  if (!userId) {
    context.res = {
      status: 401,
      body: 'The user name is required to ensure their access token'
    }
    return
  }

  context.res = {
    body: {
      cognitiveServicesKey: process.env.COGNITIVE_SERVICES_KEY,
      cognitiveServicesRegion: process.env.COGNITIVE_SERVICES_REGION
    }
  }
}

export default httpTrigger
