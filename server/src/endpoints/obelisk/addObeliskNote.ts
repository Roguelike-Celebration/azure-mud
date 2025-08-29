import DB from '../../redis'
import { User } from '../../user'
import { AuthenticatedEndpointFunction, LogFn } from '../../endpoint'

const addObeliskNote: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
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

  await DB.addRoomNote('obelisk', { id, message, authorId: user.id })

  return {
    messages: [
      {
        groupId: 'sidebar-obelisk',
        target: 'obeliskNoteAdded',
        arguments: [id, message, user.id]
      },
      {
        groupId: 'obelisk',
        target: 'noteAdded',
        arguments: ['obelisk', id, message, user.id]
      }
    ],
    httpResponse: {
      status: 200
    }
  }
}

export default addObeliskNote
