import { AzureFunction, Context, HttpRequest } from '@azure/functions'

// connection is the webPubSubConnection input binding from function.json. @azure/functions 1.x
// doesn't include a type for WebPubSub bindings, so it's typed `any` until upgrading to Functions v4.

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest, connection: any
): Promise<void> {
  context.res = { body: connection }
  context.done()
}

export default httpTrigger
