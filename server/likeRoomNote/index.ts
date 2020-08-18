import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import authenticate from '../src/authenticate'
import DB from '../src/redis'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticate(context, req, async (user) => {
    if (user.isBanned) {
      context.res = {
        status: 403,
        body: { error: 'You are currently banned and cannot do this.' }
      }
      return
    }

    const noteId = req.body && req.body.noteId
    if (!noteId) {
      context.res = {
        status: 500,
        body: 'Include a note ID!'
      }
    }

    const doLike = req.body && req.body.like
    let likes: string[] = []
    if (doLike) {
      likes = await DB.likeRoomNote(user.roomId, noteId, user.id)
    } else {
      likes = await DB.unlikeRoomNote(user.roomId, noteId, user.id)
    }

    context.bindings.signalRMessages = [
      {
        groupName: user.roomId,
        target: 'noteLikesUpdated',
        arguments: [user.roomId, noteId, likes]
      }
    ]
  })

  context.res = {
    status: 200
  }
}

export default httpTrigger
