import { AuthenticatedEndpointFunction, LogFn } from '../../endpoint'
import { User } from '../../user'
import DB from '../../redis'

const likeRoomNote: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
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
    likes = await DB.likeRoomNote(user.roomId, noteId, user.id)
  } else {
    likes = await DB.unlikeRoomNote(user.roomId, noteId, user.id)
  }

  return {
    messages: [
      {
        groupId: user.roomId,
        target: 'noteLikesUpdated',
        arguments: [user.roomId, noteId, likes]
      }
    ],
    httpResponse: { status: 200 }
  }
}

export default likeRoomNote
