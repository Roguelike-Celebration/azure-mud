import { staticRoomData } from './rooms'
import { RoomResponse } from './types'
import { awardUserBadge, User } from './user'
import { globalPresenceMessage } from './globalPresenceMessage'
import { DB } from './database'
import Redis from '../src/redis'
import { Result, Message } from './endpoint'
import { every, includes } from 'lodash'
import { Badge, UnlockableBadgeMap } from './badges'

export async function moveToRoom (
  user: User,
  newRoomId: string
): Promise<Result> {
  let to = await Redis.getRoomData(newRoomId)
  const currentRoom = await Redis.getRoomData(user.roomId)

  // TODO: This code still assumes only static rooms exist,
  // since optimizing our Redis flow for this hasn't happened yet.
  // Future Em, yell at past Em if this causes you pain
  if (!to) {
    // If the user typed a command, rather than clicking a link,
    // they may have typed a friendly version of the room name rather than the ID
    // TODO: Rooms should have a generous list of accepted names
    // DOUBLE TODO: Can we fuzzily search all exits for the current room?
    const searchStr = newRoomId.replace(' ', '').toUpperCase()
    to = Object.values(staticRoomData).find(
      (room) => room.shortName.replace(' ', '').toUpperCase() === searchStr ||
        room.displayName.replace(' ', '').toUpperCase() === searchStr ||
          room.id.toUpperCase() === searchStr
    )
  }

  if (!to) {
    // If we STILL haven't found a room, it's possible the user typed the
    // green-colored link text in the scene, which might be unique.
    // Let's try to parse that out of the current room

    // ESLint claims we can get rid of the forward slashes for - and >
    // Practical testing says otherwise.
    // eslint-disable-next-line no-useless-escape
    const complexLinkRegex = /\[\[([^\]]*?)\-\>([^\]]*?)\]\]/g
    let result
    while ((result = complexLinkRegex.exec(currentRoom.description))) {
      // "a [[foo->bar]]"" yields a result of ["[[friendly description->roomId]]", "friendly description", "roomId"]
      if (result[1] === newRoomId) {
        to = await Redis.getRoomData(result[2])
      }
    }
  }

  if (!to) {
    const messages: Message[] = [
      {
        userId: user.id,
        target: 'privateCommand',
        arguments: [`Hmm... ${newRoomId} isn't a match to any rooms.`]
      }
    ]

    return {
      messages,
      httpResponse: {
        status: 404,
        body: { error: 'Invalid room ID' }
      }
    }
  }

  const awardedBadges = awardBadges(user, to.id)

  const response: RoomResponse = {
    roomId: to.id,
    roomData: { [to.id]: to }
  }

  // TODO: Redis.getRoomData should already include note wall data
  if (to.hasNoteWall) {
    response.roomNotes = await Redis.getRoomNotes(to.id)
  }

  const result: Result = {
    httpResponse: {
      status: 200,
      body: response
    }
  }

  // If you're already in the room and try to 're-enter' the room,
  // nothing should happen: issue 162
  if (user.roomId !== to.id) {
    console.log(`Moving from ${user.roomId} to ${to.id}`)
    console.log(JSON.stringify(await globalPresenceMessage([user.roomId, to.id]), null, 2))
    await DB.setCurrentRoomForUser(user, to.id)
    console.log('After setting')
    console.log(JSON.stringify(await globalPresenceMessage([user.roomId, to.id]), null, 2))

    result.messages = [
      {
        groupId: user.roomId,
        target: 'playerLeft',
        arguments: [user.id, to.id, to.shortName]
      },
      {
        groupId: to.id,
        target: 'playerEntered',
        arguments: [user.id, user.roomId, currentRoom.shortName]
      },
      await globalPresenceMessage([user.roomId, to.id])
    ]

    if (awardedBadges.length > 0) {
      result.messages.push({
        groupId: user.roomId,
        target: 'unlockBadge',
        arguments: [awardedBadges]
      })
    }

    result.groupManagementTasks = [
      {
        userId: user.id,
        groupId: user.roomId,
        action: 'remove'
      },
      {
        userId: user.id,
        groupId: to.id,
        action: 'add'
      }
    ]
  }

  return result
}

function awardBadges (user: User, roomId: string) {
  // "If the user is in this room ID and
  // doesn't have the matching badge,
  // give them the badge with this emoji"
  const tuples = [
    ['robots', '🤖'],
    ['sfHub', '👾'],
    ['transmute', '🧙‍♀️'],
    ['exploreHub', '⚔️'],
    ['steam', '💾']
  ]

  const unlockedEmoji: Badge[] = []

  tuples.forEach(([room, emoji]) => {
    if (roomId === room &&
    !includes(user.unlockedBadges, UnlockableBadgeMap[emoji])) {
      console.log('Awarding badge', emoji, UnlockableBadgeMap[emoji])
      awardUserBadge(user.id, UnlockableBadgeMap[emoji])
      unlockedEmoji.push(UnlockableBadgeMap[emoji])
    }
  })

  if (unlockedEmoji.length > 0) {
    if (every(tuples, ([_, emoji]) => {
      return includes(user.unlockedBadges, UnlockableBadgeMap[emoji])
    })) {
      awardUserBadge(user.id, UnlockableBadgeMap['🌎'])
      unlockedEmoji.push(UnlockableBadgeMap['🌎'])
    }
  }

  return unlockedEmoji
}
