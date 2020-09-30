import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { toServerSettings } from '../src/types'
import authenticate from '../src/authenticate'
import { User, isMod } from '../src/user'
import DB from '../src/redis'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticate(context, req, false, async (user) => {
    if (req.method === "GET") {
      await getServerSettings(context)
    } else if (req.method === "POST") {
      await postServerSettings(context, req, user)
    }
  })
}

async function getServerSettings(context: Context) {
  const settings = await DB.getServerSettings()
  context.res = {
    status: 200,
    body: settings

  }
}

async function postServerSettings(context: Context, req: HttpRequest, user: User) {
  if (!await isMod(user.id)) {
    context.res = {
      status: 403,
      body: { error: 'You are not a mod!' }
    }
    return
  } else if (!req.body) {
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

  await DB.setServerSettings(newSettings)

  context.bindings.signalRMessages = [
    {
      target: 'serverSettings',
      arguments: [newSettings]
    }
  ]

  context.res = {
    status: 200
  }
}

export default httpTrigger
