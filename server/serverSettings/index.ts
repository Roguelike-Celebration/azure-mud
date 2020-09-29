import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { look } from '../src/look'
import { ServerSettings, toServerSettings } from '../src/types'
import authenticate from '../src/authenticate'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticate(context, req, false, async (user) => {
    if (req.method === "GET") {
      getServerSettings(context)
    } else if (req.method === "POST") {
      postServerSettings(context, req)
    }
  })
}

function getServerSettings(context: Context) {
  context.res = {
    status: 200,
    body: {
      movementMessagesHideThreshold: 20,
      movementMessagesHideRoomIds: []
    }
  }
}

function postServerSettings(context: Context, req: HttpRequest) {
  if (!req.body) {
    context.res = {
      status: 400,
      body: { error: 'Must include a body!' }
    }
    return
  }
  const newSettings = toServerSettings(req.body)
  if (!newSettings) {
    context.res = {
      status: 400,
      body: { error: 'Could not parse server settings!' }
    }
    return
  }

  // TODO: Store server settings in DB!

  context.res = {
    status: 200,
    body: {
      movementMessagesHideThreshold: 20,
      movementMessagesHideRoomIds: []
    }
  }
}

export default httpTrigger
