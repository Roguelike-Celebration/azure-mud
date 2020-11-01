import { allPresenceData, globalPresenceMessage } from '../globalPresenceMessage'
import { userHeartbeatReceived } from '../heartbeat'
import { roomData } from '../rooms'
import setUpRoomsForUser from '../setUpRoomsForUser'
import { RoomResponse } from '../types'
import { User, isMod, minimizeUser } from '../user'
import { AuthenticatedEndpointFunction, LogFn, Result } from '../endpoint'
import DB from '../redis'

const connect: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  log('We have a user!', user.id)
  const result: Result = {}

  // If the room is deleted, we might have a stranded user, so dump them in the entryway
  if (user.room === undefined) {
    user.roomId = 'entryway'
    user.room = roomData.entryway
  }

  await DB.setCurrentRoomForUser(user.id, user.roomId)
  await DB.addOccupantToRoom(user.roomId, user.id)
  await userHeartbeatReceived(user.id)

  const userMap = await DB.minimalProfileUserMap()

  const response: RoomResponse = {
    roomId: user.room.id,
    presenceData: await allPresenceData(),
    users: userMap,
    roomData,
    // TODO: Instead of another DB call, delete the non-public fields from the user we already have?
    profile: await DB.getPublicUser(user.id)
  }

  if (roomData[user.roomId].hasNoteWall) {
    response.roomNotes = await DB.getRoomNotes(user.roomId)
  }

  result.httpResponse = {
    status: 200,
    body: response
  }

  result.groupManagementTasks = [
    ...setUpRoomsForUser(user.id, user.roomId),
    {
      userId: user.id,
      groupId: user.roomId,
      action: 'add'
    }
  ]

  if (await isMod(user.id)) {
    result.groupManagementTasks.push({
      userId: user.id,
      groupId: 'mods',
      action: 'add'
    })
  }

  log('Setting messages')

  const minimalUser = minimizeUser(user)

  result.messages = [
    {
      groupName: user.roomId,
      target: 'playerConnected',
      arguments: [minimalUser]
    },
    {
      target: 'usernameMap',
      arguments: [{ [user.id]: minimalUser }]
    },
    await globalPresenceMessage([user.roomId])
  ]

  log('Finished the thing')
  log(result)

  return result
}

export default connect
