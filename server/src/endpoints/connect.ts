import { globalPresenceMessage } from '../globalPresenceMessage'
import { userHeartbeatReceived } from '../heartbeat'
import setUpRoomsForUser from '../setUpRoomsForUser'
import { RoomResponse } from '../types'
import { User, isMod, minimizeUser } from '../user'
import { AuthenticatedEndpointFunction, LogFn, Result } from '../endpoint'
import DB from '../redis'
import { UnlockableBadges } from '../badges'
import { minimalRoomData, Room } from '../rooms'

// TODO: We are currently including all static room data in this initial request
// That may not be eventually what we want

const connect: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  log('We have a user!', user.id)
  const result: Result = {}

  let room = await DB.getRoomData(user.roomId)

  // WARNING: For now, checking the existence of a roomId in roomData is a good safeguard
  // But this may bite us when/if we ever have programmatic room creation
  if (user.roomId === undefined || !room) {
    user.roomId = 'entryway'
    room = await DB.getRoomData(user.roomId)
  }

  await DB.setCurrentRoomForUser(user, user.roomId)
  await userHeartbeatReceived(user)

  const users = await DB.getAllUsers()
  const userMap = {}
  users.forEach(u => {
    userMap[u.id] = minimizeUser(u)
  })

  const response: RoomResponse = {
    roomId: user.roomId,
    presenceData: await DB.allRoomOccupants(),
    users: userMap,

    // WARNING: How we're fetching minimalRoomData may be inefficient
    // DOUBLE WARNING: The way we're currently storing both MinimalRoom and Room data
    // in the same object is extremely un-TypeScript-y. Refactoring things to be correct
    // would be a lot of work, so for the sake of "the event is in a few days" we're just
    // hand-waving the definitions and pretending MinimalRoom data doesn't exist
    roomData: { ...(await minimalRoomData() as {[id: string]: Room}), [user.roomId]: room },

    profile: user,
    unlockableBadges: UnlockableBadges
  }

  // TODO: The thing that dynamically fetches room data should
  // be smart enough to include roomNotes if necessary
  if (room.hasNoteWall) {
    response.roomNotes = await DB.getRoomNotes(user.roomId)
  }

  result.httpResponse = {
    status: 200,
    body: response
  }

  result.groupManagementTasks = [
    ...await setUpRoomsForUser(user.id, user.roomId),
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

  const minimalUser = minimizeUser(user)

  result.messages = [
    {
      groupId: user.roomId,
      target: 'playerConnected',
      arguments: [minimalUser]
    },
    {
      target: 'usernameMap',
      arguments: [{ [user.id]: minimalUser }]
    },
    await globalPresenceMessage([user.roomId])
  ]

  log('Finished all of "connect"')
  log(result)

  return result
}

export default connect
