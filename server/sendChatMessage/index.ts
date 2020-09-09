import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { moveToRoom } from '../src/moveToRoom'
import { whisper } from '../src/whisper'
import { shout } from '../src/shout'
import { look } from '../src/look'
import authenticate from '../src/authenticate'
import { getUserIdForUsername } from '../src/user'
import { MAX_MESSAGE_LENGTH } from '../src/config'

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  await authenticate(context, req, true, async (user) => {
    if (user.isBanned) {
      context.res = {
        status: 403,
        body: { error: 'You are currently banned and cannot do this.' }
      }
      return
    }

    const message = req.body && req.body.text
    if (!message) {
      context.res = {
        status: 500,
        body: 'Include a user ID and a message!'
      }
      return
    } else if (message.length > MAX_MESSAGE_LENGTH) { // Matches MAX_MESSAGE_LENGTH from client's message.ts - unsure how to share
      context.res = {
        status: 400,
        body: 'Message length too long!'
      }
      return
    }

    const moveMatch = /^\/(go|move) (.+)/.exec(message)
    if (moveMatch) {
      return await moveToRoom(user, moveMatch[2], context)
    }

    const whisperMatch = /^\/(whisper) (.+?) (.+)/.exec(message)
    if (whisperMatch) {
      return await whisper(user, whisperMatch[2], whisperMatch[3], context)
    }

    const shoutMatch = /^\/(shout) (.+)/.exec(message)
    if (shoutMatch) {
      return await shout(user, req.body.id, shoutMatch[2], context)
    }

    const emoteMatch = /^\/(me|emote) (.+)/.exec(message)
    if (emoteMatch) {
      context.bindings.signalRMessages = [
        {
          groupName: user.roomId,
          target: 'emote',
          arguments: [req.body.id, user.id, emoteMatch[2]]
        }
      ]
      return
    }

    const modMatch = /^\/(mod|mods|moderator|moderators) (.+)/.exec(message)
    if (modMatch) {
      context.bindings.signalRMessages = [
        // Send to the mod-only group
        {
          groupName: 'mods',
          target: 'mods',
          arguments: [user.id, modMatch[2]]
        },
        // We also send it back to the user so it shows up in their chat window
        {
          userId: user.id,
          target: 'mods',
          arguments: [user.id, modMatch[2]]
        }
      ]
      return
    }

    const lookMatch = /^\/(look) (.+)/.exec(message)
    if (lookMatch) {
      const lookUserId = await getUserIdForUsername(lookMatch[2])
      if (!lookUserId) {
        context.res = {
          status: 400,
          body: { error: `Could not find the user ${lookMatch[2]}` }
        }
        return
      }
      return await look(lookUserId, context)
    }

    context.res = {
      status: 200,
      body: {}
    }

    context.log(`Sending to ${user.roomId}: ${message} from ${user.id}`)

    context.bindings.signalRMessages = [
      {
        groupName: user.roomId,
        target: 'chatMessage',
        arguments: [req.body.id, user.id, message]
      }
    ]
  })
}

export default httpTrigger
