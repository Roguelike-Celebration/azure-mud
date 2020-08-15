import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import authenticate from '../src/authenticate'
import logSignalR from '../src/logSignalR'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticate(context, req, (user) => {
    context.log('Broadcasting peer ID', user.roomId, user.id)
    context.bindings.signalRMessages = [
      {
        target: 'webrtcPeerId',
        arguments: [user.id]
      }
    ]
  })

  logSignalR(context)
}

export default httpTrigger
