import { AuthenticatedEndpointFunction, LogFn } from '../endpoint.js'
import { User } from '../user.js'

const deleteMessage: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const messageId = inputs.messageId
  if (!messageId) {
    return {
      httpResponse: {
        status: 400,
        body: { error: 'You did not include a message to delete.' }
      }
    }
  }

  return {
    messages: [
      {
        target: 'deleteMessage',
        arguments: [user.id, messageId]
      }
    ],
    httpResponse: {
      status: 200,
      body: {}
    }
  }
}

export default deleteMessage
