import { roomData } from './rooms'
import { RoomResponse } from './types'
import { User } from './user'
import { globalPresenceMessage } from './globalPresenceMessage'
import { DB } from './database'
import Redis from '../src/redis'
import { Result } from './endpoint'

export async function moveToRoom (
  user: User,
  newRoomId: string
): Promise<Result> {
  let to = roomData[newRoomId]
  const currentRoom = roomData[user.roomId]

  if (!to) {
    // If the user typed a command, rather than clicking a link,
    // they may have typed a friendly version of the room name rather than the ID
    // TODO: Rooms should have a generous list of accepted names
    // DOUBLE TODO: Can we fuzzily search all exits for the current room?
    const searchStr = newRoomId.replace(' ', '').toUpperCase()
    to = Object.values(roomData).find(
      (room) => room.shortName.replace(' ', '').toUpperCase() === searchStr ||
        room.displayName.replace(' ', '').toUpperCase() === searchStr
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
        to = roomData[result[2]]
      }
    }
  }

  if (!to) {
    return {
      httpResponse: {
        status: 404,
        body: { error: 'Invalid room ID' }
      }
    }
  }

  const response: RoomResponse = {
    roomId: to.id
  }

  if (roomData[to.id].hasNoteWall) {
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
