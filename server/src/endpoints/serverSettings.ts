import { AuthenticatedEndpointFunction, EndpointFunction, LogFn } from '../endpoint'
import { User } from '../user'
import { DB } from '../database'
import { toServerSettings } from '../types'

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
