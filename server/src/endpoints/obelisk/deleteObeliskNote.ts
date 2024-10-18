import { AuthenticatedEndpointFunction, LogFn, Message } from '../../endpoint'
import { isMod, User } from '../../user'
import DB from '../../redis'
import { v4 as uuid } from 'uuid'

const deleteObeliskNote: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const noteId = inputs.noteId
  if (!noteId) {
    return {
      httpResponse: {
        status: 500,
        body: 'Include a note ID!'
      }
    }
  }

  const notes = await DB.getRoomNotes('obelisk')
  const note = notes.find(n => n.id === noteId)

  if (note.authorId !== user.id && !(await isMod(user.id))) {
    return {
      httpResponse: {
        status: 403,
        body: 'You cannot delete this note!'
      }
    }
  }

  await DB.deleteRoomNote('obelisk', noteId)

  const messages: Message[] = [
    {
      groupId: 'obelisk',
      target: 'noteRemoved',
      arguments: ['obelisk', noteId]
    },
    {
      groupId: 'sidebar-obelisk',
      target: 'obeliskNoteRemoved',
      arguments: [noteId]
    }
  ]

  if (note.authorId !== user.id) {
    messages.push({
      userId: note.authorId,
      target: 'emote',
      arguments: [uuid(), user.id, 'has removed a note of yours from the obelisk']
    })
  }

  return {
    messages,
    httpResponse: { status: 200 }
  }
}

export default deleteObeliskNote
