import { AuthenticatedEndpointFunction, GroupManagementTask, LogFn, Message } from '../endpoint'
import { User } from '../user'
import DB from '../redis'
import { moveToRoom } from '../moveToRoom'

/* Moves all users to entryway. Should be used ONLY as an administrative command while the space is unpopulated,
 * because it  will not properly resolve the clients which are currently logged in and is gonna look buggy until
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
    for (const user of allUsers) {
      const tasks = await moveToRoom(user, 'entryway')
      if (tasks && tasks.messages) {
        allMessages = allMessages.concat(tasks.messages)
      }
      if (tasks && tasks.groupManagementTasks) {
        managementTasks = managementTasks.concat(tasks.groupManagementTasks)
      }
    }
  } catch (e) {
    const err = e as Error
    log("ERROR!")
    log(err.message)
    if (err.stack) { log(err.stack) }
  }

  log(allMessages)
  log(managementTasks)

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
