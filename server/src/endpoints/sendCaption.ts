import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'

import { MESSAGE_MAX_LENGTH } from '../config'
import { User } from '../user'

const sendCaption: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const message = inputs.text
  if (!message) {
    return {
      httpResponse: {
        status: 500,
        body: 'Include a user ID and a message!'
      }
    }
  } else if (message.length > MESSAGE_MAX_LENGTH) {
    // TODO: Not sure if this makes sense for captions.
    return {
      httpResponse: {
        status: 400,
        body: 'Message length too long!'
      }
    }
  }

  log(`Sending caption to ${user.roomId}: ${message} from ${user.id}`)

  return {
    messages: [
      {
        groupName: user.roomId,
        target: 'caption',
        arguments: [inputs.id, user.id, message]
      }
    ],
    httpResponse: { status: 200 }
  }
}

export default sendCaption
