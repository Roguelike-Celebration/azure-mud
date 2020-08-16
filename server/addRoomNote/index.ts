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

    const message = req.body && req.body.message
    const id = req.body && req.body.id
    if (!message || !id) {
      context.res = {
        status: 500,
        body: 'Include a post-it message and an ID!'
      }
    }

    await DB.addRoomNote(user.roomId, { id, message, authorId: user.id })

    context.bindings.signalRMessages = [
      {
        groupName: user.roomId,
        target: 'noteAdded',
        arguments: [user.roomId, id, message, user.id]
      }
    ]
  })

  context.res = {
    status: 200
  }
}

export default httpTrigger
