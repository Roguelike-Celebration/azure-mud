import { AuthenticatedEndpointFunction, LogFn } from '../../endpoint'
import { User } from '../../user'
import DB from '../../redis'

const likeObeliskNote: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const noteId = inputs.noteId
  if (!noteId) {
    return {
      httpResponse: {
        status: 500,
        body: 'Include a note ID!'
      }
    }
  }

  const doLike = inputs.like
  let likes: string[] = []
  if (doLike) {
    likes = await DB.likeRoomNote('obelisk', noteId, user.id)
  } else {
    likes = await DB.unlikeRoomNote('obelisk', noteId, user.id)
  }

  return {
    messages: [
      {
        groupId: 'sidebar-obelisk',
        target: 'obeliskNoteLikesUpdated',
        arguments: [noteId, likes]
      },
      {
        groupId: 'obelisk',
        target: 'noteLikesUpdated',
        arguments: ['obelisk', noteId, likes]
      }
    ],
    httpResponse: { status: 200 }
  }
}

export default likeObeliskNote
