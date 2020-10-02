import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { v4 as uuid } from 'uuid'

import DB from '../src/redis'
import authenticate from '../src/authenticate'
import { minimizeUser, updateUserProfile } from '../src/user'
import generators from '../src/generators'
import itemWhitelist from '../src/itemWhitelist'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await authenticate(context, req, false, async (user) => {
    if (user.isBanned) {
      context.res = {
        status: 403,
        body: { error: 'You are currently banned and cannot do this.' }
      }
      return
    }

    let item: string
    let privateActionString: string

    if (req.body && req.body.list) {
      const generator = generators[req.body.list]

      if (!generator) {
        context.res = {
          status: 400,
          body: { error: `You included an invalid list: ${req.body.list}` }
        }
        return
      }

      item = generator.generate()
      privateActionString = generator.actionString(item)
      context.log(privateActionString)
    } else if (req.body && req.body.item) {
      item = req.body.item
      if (!itemWhitelist.includes(item)) {
        context.res = {
          status: 400,
          body: { error: 'You included an invalid item' }
        }
        return
      }
    } else {
      context.res = {
        status: 400,
        body: { error: 'Include an item or list!' }
      }
      return
    }

    const actionString = `picks up ${item}.`

    const newProfile = await updateUserProfile(user.id, { item })

    context.bindings.signalRMessages = [
      {
        groupName: user.roomId,
        target: 'emote',
        arguments: [uuid(), user.id, actionString]
      },
      {
        target: 'usernameMap',
        arguments: [{ [user.id]: minimizeUser(newProfile) }]
      }
    ]

    if (privateActionString) {
      context.bindings.signalRMessages.push({
        userId: user.id,
        target: 'privateItemPickup',
        arguments: [privateActionString]
      })
    }

    context.res = { status: 200 }
  })
}

export default httpTrigger
