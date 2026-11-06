import { AuthenticatedEndpointFunction, LogFn, Message } from '../endpoint.js'
import generators from '../generators/index.js'
import { User } from '../user.js'

const displayMessage: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  let message: string
  let actionMessage: string

  if (inputs.list) {
    const generator = generators[inputs.list]

    if (!generator) {
      return {
        httpResponse: {
          status: 400,
          body: { error: `You included an invalid list: ${inputs.list}` }
        }
      }
    }

    message = generator.generate()
    actionMessage = generator.actionString(message)
    log(message)
    log(actionMessage)
  } else if (inputs.message) {
    actionMessage = inputs.message
  } else {
    return {
      httpResponse: {
        status: 400,
        body: { error: 'Include an item or list!' }
      }
    }
  }

  const messages: Message[] = [
    {
      userId: user.id,
      target: 'privateCommand',
      arguments: [actionMessage]
    }
  ]

  return {
    messages,
    httpResponse: { status: 200 }
  }
}

export default displayMessage
