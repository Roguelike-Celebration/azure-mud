import DB from '../../redis'
import { User } from '../../user'
import { AuthenticatedEndpointFunction, LogFn } from '../../endpoint'

const addRoomNote: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const message = inputs.message
  const id = inputs.id
  if (!message || !id) {
    return {
      httpResponse: {
        status: 500,
        body: 'Include a post-it message and an ID!'
      }
    }
  }

  await DB.addRoomNote(user.roomId, { id, message, authorId: user.id })

  return {
    messages: [
      {
        groupId: user.roomId,
        target: 'noteAdded',
        arguments: [user.roomId, id, message, user.id]
      }
    ],
    httpResponse: {
      status: 200
    }
  }
}

export default addRoomNote
