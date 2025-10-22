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
    to = await Redis.getRoomData(searchStr)

    if (!to) {
      const toId = await Redis.getRoomIdFromFuzzySearch(searchStr)
      if (toId) {
        to = await Redis.getRoomData(toId)
      }
    }
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
        status: 400,
        body: { error: 'Invalid room ID' }
      }
    }
  }

  to.users = await DB.roomOccupants(to.id)

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
      // We want to use the HTTP return as little as possible, and use websockets more - this helps dealing with
      // desyncs. However, we want to return the roomId to allow for integrity checking on the client side.
      // Unfortunately things like outgoing whispers/messages still encounter desyncs. That's on the to-do list.
      body: { roomId: to.id, moved: true }
    }
  }

  // If you're already in the room and try to 're-enter' the room,
  // nothing should happen: issue 162
  if (user.roomId !== to.id) {
    // TODO: console.log doesn't work pass in the logFn
    console.log(`Moving from ${user.roomId} to ${to.id}`)
    // This is to force the resolution of the unlocked badges
    // TODO: Find a nicer way to do this
    await DB.getUser(user.id)
    await DB.setCurrentRoomForUser(user, to.id)

    result.messages = [
      {
        groupId: user.roomId,
        target: 'playerLeft',
        arguments: [user.id, to.id, to.shortName]
      },
      {
        groupId: to.id,
        target: 'playerEntered',
        arguments: [user.id, user.roomId, currentRoom.shortName || 'undefined']
      },
      {
        userId: user.id,
        target: 'updatedCurrentRoom',
        arguments: [response]
      },
      await globalPresenceMessage([user.roomId, to.id])
    ]

    if (awardedBadges.length > 0) {
      result.messages.push({
        userId: user.id,
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
  const roomBadges = [
    ['dockingBay', '🚀'],
    ['oxygenFarm', '🌱'],
    ['experimentalBiology', '🧙‍♀️'],
    ['adventurersGuildHall', '⚔️'],
    ['officeOfSteam', '💾'],
    ['thesisDefense', 'golden_thesis'],
    ['loversLake', 'phylactery'],
    ['procedural', 'nega_ticket'],
    ['underlab', 'undermuffin'],
    // begin 2023
    ['lockedDoor', '🔑'],
    ['hotDogStand', '🌭'],
    ['emptyStore', '🎃'],
    ['orbOfZot', '🔮'],
    ['coconut', '👁️'],
    ['tenGold', 'turkey_leg'],
    ['buildAToy', 'goblin_barbie'],
    ['ask', 'goblin_appreciation']
    // begin 2025
    ['golgotha', 'chadOfCloaca'],
    ['fortySeven', 'mimeCrown'],
    ['eraja', 'rainbowCrown'],
    ['mirrorLand', 'mirror']	
  ]

  const unlockedEmoji: Badge[] = []

  // Unlock the "I attended!" badge for the current event
  // This is gated on time, so you can update this for a future event.
  // Just change the emoji, the month, and the year.
  const currentEventBadge = UnlockableBadgeMap['9️⃣']
  const today = new Date()
  if (!includes(user.unlockedBadges, currentEventBadge) &&
    today.getMonth() === 9 && // getMonth is 0-indexed, not 1-indexed
    today.getFullYear() === 2025) {
    // We handle this differently than others because we want it to be quietly added
    // rather than popping a modal dialog
    //
    // Note that this does mean someone will have to refresh the page after first pageload to apply it.
    // That's fine. Maybe eventually we can add a "silent" flag to the client unlock emoji action
    awardUserBadge(user.id, currentEventBadge)
  }

  roomBadges.forEach(([room, emoji]) => {
    if (roomId === room &&
    !includes(user.unlockedBadges.map(b => b.emoji), emoji)) {
      console.log('Awarding badge', emoji, UnlockableBadgeMap[emoji])
      awardUserBadge(user.id, UnlockableBadgeMap[emoji])
      unlockedEmoji.push(UnlockableBadgeMap[emoji])
    }
  })

  if (unlockedEmoji.length > 0) {
    if (every(roomBadges, ([_, emoji]) => {
      return includes(user.unlockedBadges, UnlockableBadgeMap[emoji])
    })) {
      awardUserBadge(user.id, UnlockableBadgeMap['🌎'])
      unlockedEmoji.push(UnlockableBadgeMap['🌎'])
    }
  }

  return unlockedEmoji
}
