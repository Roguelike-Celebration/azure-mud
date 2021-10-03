import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { getUserIdFromHeaders } from '../src/authenticate'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const userId = await getUserIdFromHeaders(context, req)

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
