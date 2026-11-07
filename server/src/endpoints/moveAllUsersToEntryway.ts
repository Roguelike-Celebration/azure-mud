import { AuthenticatedEndpointFunction, GroupManagementTask, LogFn, Message } from '../endpoint.js'
import { moveToRoom } from '../moveToRoom.js'
import DB from '../redis.js'
import { User } from '../user.js'

/* Moves all users to entryway. Should be used ONLY as an administrative command while the space is unpopulated,
 * because it will not properly resolve the clients which are currently logged in and is gonna look buggy until
 * the user manually moves. */
const moveAllUsersToEntryway: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  const start = Math.round(Date.now() / 1000)

  const entryway = DB.getRoomData('entryway')
  if (!entryway) {
    return {
      httpResponse: {
        status: 500,
        body: { error: 'No room with id=\'entryway\' was found in the room data! It is very important that there be one and you should make one.' }
      }
    }
  }

  let allMessages: Message[] = []
  let managementTasks: GroupManagementTask[] = []

  const allUsers = await DB.getAllUsers()

  try {
    for (const aUser of allUsers) {
      const tasks = await moveToRoom(aUser, 'entryway')
      if (tasks && tasks.messages) {
        allMessages = allMessages.concat(tasks.messages)
      }
      if (tasks && tasks.groupManagementTasks) {
        managementTasks = managementTasks.concat(tasks.groupManagementTasks)
      }
    }
  } catch (e) {
    log('ERROR: moveAllUsersToEntryway: Error while moving users:', e)
  }
  log(`moveAllUsersToEntryway results: ${allUsers.length} users, ${allMessages.length} messages, ` +
    `${managementTasks.length} group mgmt tasks`, { allMessages, managementTasks })

  return {
    httpResponse: {
      status: 200,
      body: { numUsers: allUsers.length, numMoved: allUsers.length, seconds: Math.round(Date.now() / 1000) - start }
    },
    messages: allMessages,
    groupManagementTasks: managementTasks
  }
}

export default moveAllUsersToEntryway
