import { AuthenticatedEndpointFunction, LogFn } from '../endpoint'

import { moveToRoom } from '../moveToRoom'
import { whisper } from '../whisper'
import { shout } from '../shout'
import { look } from '../look'
import { getUserIdForUsername, User } from '../user'
import { MESSAGE_MAX_LENGTH } from '../config'
import { dance } from '../dance'
import { interact } from '../interact'

const sendChatMessage: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const message = inputs.text
  if (!message) {
    return {
      httpResponse: {
        status: 500,
        body: 'Include a user ID and a message!'
      }
    }
  } else if (message.length > MESSAGE_MAX_LENGTH) {
    return {
      httpResponse: {
        status: 400,
        body: 'Message length too long!'
      }
    }
  }

  const moveMatch = /^\/(go|move) (.+)/.exec(message)
  if (moveMatch) {
    return await moveToRoom(user, moveMatch[2])
  }

  const whisperMatch = /^\/(whisper) (.+?) (.+)/.exec(message)
  if (whisperMatch) {
    return await whisper(user, whisperMatch[2], whisperMatch[3])
  }

  const shoutMatch = /^\/(shout) (.+)/.exec(message)
  if (shoutMatch) {
    return await shout(user, inputs.id, shoutMatch[2])
  }

  const emoteMatch = /^\/(me|emote) (.+)/.exec(message)
  if (emoteMatch) {
    return {
      messages: [
        {
          groupId: user.roomId,
          target: 'emote',
          arguments: [inputs.id, user.id, emoteMatch[2]]
        }
      ]
    }
  }

  const danceMatch = /^\/(dance)(.*)/.exec(message)
  if (danceMatch) {
    return dance(user, inputs.id)
  }

  const interactMatch = /^\/(interact|get) (.*)/.exec(message)
  if (interactMatch) {
    var inspectedObject = interactMatch[2]
    return await interact(user, inputs.id, inspectedObject)
  }

  const modMatch = /^\/(mod|mods|moderator|moderators) (.+)/.exec(message)
  if (modMatch) {
    return {
      messages: [
      // Send to the mod-only group
        {
          groupId: 'mods',
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
    }
  }

  const lookMatch = /^\/(look) (.+)/.exec(message)
  if (lookMatch) {
    const lookUserId = await getUserIdForUsername(lookMatch[2])
    if (!lookUserId) {
      return {
        httpResponse: {
          status: 400,
          body: { error: `Could not find the user ${lookMatch[2]}` }
        }
      }
    }
    return await look(lookUserId)
  }

  log(`Sending to ${user.roomId}: ${message} from ${user.id}`)

  return {
    messages: [
      {
        groupId: user.roomId,
        target: 'chatMessage',
        arguments: [inputs.id, user.id, message]
      }
    ],
    httpResponse: { status: 200 }
  }
}

export default sendChatMessage
