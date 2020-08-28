import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { v4 as uuid } from 'uuid'

import authenticate from '../src/authenticate'
import DB from '../src/redis'
import { isMod } from '../src/user'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticate(context, req, true, async (user) => {
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

    const notes = await DB.getRoomNotes(user.roomId)
    const note = notes.find(n => n.id === noteId)

    if (note.authorId !== user.id && !isMod(user.id)) {
      context.res = {
        status: 403,
        body: 'You cannot delete this note!'
      }
    }

    await DB.deleteRoomNote(user.roomId, noteId)

    const messages: any = [
      {
        groupName: user.roomId,
        target: 'noteRemoved',
        arguments: [user.roomId, noteId]
      }
    ]

    if (note.authorId !== user.id) {
      messages.push({
        userId: note.authorId,
        target: 'emote',
        arguments: [uuid(), user.id, `has removed a note of yours from ${user.room.shortName} wall`]
      })
    }

    context.bindings.signalRMessages = messages
  })

  context.res = {
    status: 200
  }
}

export default httpTrigger
