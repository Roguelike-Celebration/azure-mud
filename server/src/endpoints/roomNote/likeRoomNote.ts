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

  const messages = [
    {
      groupId: user.roomId,
      target: 'noteLikesUpdated',
      arguments: [user.roomId, noteId, likes]
    }
  ]

  // The sidebar obelisk and obelisk room share a noteWall, but have different pubsub groups to notify
  // Liking an obelisk note from the sidebar is a different function, this is just the obelisk room case
  if (user.roomId === 'obelisk') {
    messages.push({
      groupId: 'sidebar-obelisk',
      target: 'obeliskNoteLikesUpdated',
      arguments: [noteId, likes]
    })
  }

  return {
    messages,
    httpResponse: { status: 200 }
  }
}

export default likeRoomNote
