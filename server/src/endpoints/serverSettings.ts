import { DB } from '../database.js'
import { AuthenticatedEndpointFunction, EndpointFunction, LogFn } from '../endpoint.js'
import { toServerSettings } from '../types.js'
import { User } from '../user.js'

const getServerSettings: EndpointFunction = async (inputs: any, log: LogFn) => {
  const settings = await DB.getServerSettings()
  return {
    httpResponse: {
      status: 200,
      body: settings
    }
  }
}

const postServerSettings: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  if (!inputs) {
    return {
      httpResponse: {
        status: 400,
        body: { error: 'Must include a body!' }
      }
    }
  }
  const newSettings = toServerSettings(inputs)
  if (!newSettings) {
    return {
      httpResponse: {
        status: 400,
        body: { error: 'Could not parse server settings!' }
      }
    }
  }

  await DB.setServerSettings(newSettings)

  return {
    messages: [
      {
        target: 'serverSettings',
        arguments: [newSettings]
      }
    ],
    httpResponse: { status: 200 }
  }
}

export { getServerSettings, postServerSettings }
