import { roomData } from './rooms'
import { RoomResponse } from './types'
import { User } from './user'
import { globalPresenceMessage } from './globalPresenceMessage'
import DB from '../src/cosmosdb'
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
    console.log(await globalPresenceMessage([user.roomId, to.id]))
    await DB.setCurrentRoomForUser(user, to.id)
    console.log('After setting')
    console.log(await globalPresenceMessage([user.roomId, to.id]))

    result.messages = [
      {
        groupName: user.roomId,
        target: 'playerLeft',
        arguments: [user.id, to.id, to.shortName]
      },
      {
        groupName: to.id,
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

const foo = { httpResponse: { status: 200, body: { roomId: 'lounge', presenceData: [], users: [], roomData: [], profile: [] } }, groupManagementTasks: [{ userId: '19924413', groupId: 'theater', action: 'remove' }, { userId: '19924413', groupId: 'northShowcaseHall', action: 'remove' }, { userId: '19924413', groupId: 'eastShowcaseHall', action: 'remove' }, { userId: '19924413', groupId: 'southShowcaseHall', action: 'remove' }, { userId: '19924413', groupId: 'westShowcaseHall', action: 'remove' }, { userId: '19924413', groupId: 'unconference', action: 'remove' }, { userId: '19924413', groupId: 'minetown', action: 'remove' }, { userId: '19924413', groupId: 'oracle', action: 'remove' }, { userId: '19924413', groupId: 'tower', action: 'remove' }, { userId: '19924413', groupId: 'castle', action: 'remove' }, { userId: '19924413', groupId: 'sokoban', action: 'remove' }, { userId: '19924413', groupId: 'astralPlane', action: 'remove' }, { userId: '19924413', groupId: 'kitchen', action: 'remove' }, { userId: '19924413', groupId: 'kitchenTableA', action: 'remove' }, { userId: '19924413', groupId: 'kitchenTableB', action: 'remove' }, { userId: '19924413', groupId: 'kitchenTableC', action: 'remove' }, { userId: '19924413', groupId: 'bar', action: 'remove' }, { userId: '19924413', groupId: 'statue', action: 'remove' }, { userId: '19924413', groupId: 'danceFloor', action: 'remove' }, { userId: '19924413', groupId: 'shippingContainer', action: 'remove' }, { userId: '19924413', groupId: 'entryway', action: 'remove' }, { userId: '19924413', groupId: 'foyer', action: 'remove' }, { userId: '19924413', groupId: 'swag', action: 'remove' }, { userId: '19924413', groupId: 'atelier', action: 'remove' }, { userId: '19924413', groupId: 'study', action: 'remove' }, { userId: '19924413', groupId: 'workbench', action: 'remove' }, { userId: '19924413', groupId: 'hiddenPortalRoom', action: 'remove' }, { userId: '19924413', groupId: 'loungeDungeonDrawingRoom', action: 'remove' }, { userId: '19924413', groupId: 'loungeDungeonBedroom', action: 'remove' }, { userId: '19924413', groupId: 'loungeDungeonClosetEntryway', action: 'remove' }, { userId: '19924413', groupId: 'loungeDungeonClosetPath', action: 'remove' }, { userId: '19924413', groupId: 'loungeDungeonClosetShoePath', action: 'remove' }, { userId: '19924413', groupId: 'loungeDungeonClosetShoePathEnd', action: 'remove' }, { userId: '19924413', groupId: 'loungeDungeonClosetBowtiePrep', action: 'remove' }, { userId: '19924413', groupId: 'loungeDungeonClosetBowtieWeapon', action: 'remove' }, { userId: '19924413', groupId: 'loungeDungeonClosetBowtieCoat', action: 'remove' }, { userId: '19924413', groupId: 'loungeDungeonClosetBowtieCoatFight', action: 'remove' }, { userId: '19924413', groupId: 'loungeDungeonClosetMannequinAmbush', action: 'remove' }, { userId: '19924413', groupId: 'loungeDungeonClosetTowerOfShoesDoor', action: 'remove' }, { userId: '19924413', groupId: 'lounge', action: 'add' }], messages: [{ groupName: 'lounge', target: 'playerConnected', arguments: [] }, { target: 'usernameMap', arguments: [] }, { target: 'presenceData', arguments: [] }] }
