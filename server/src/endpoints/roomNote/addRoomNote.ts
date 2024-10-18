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

  const result = {
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

  // The sidebar obelisk and obelisk room share a noteWall, but have different pubsub groups to notify
  // Adding an obelisk note from the sidebar is a different function, this is just the obelisk room case
  if (user.roomId === 'obelisk') {
    result.messages.push({
      groupId: 'sidebar-obelisk',
      target: 'obeliskNoteAdded',
      arguments: [id, message, user.id]
    })
  }

  return result
}

export default addRoomNote
