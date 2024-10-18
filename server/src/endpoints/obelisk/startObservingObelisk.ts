import DB from '../../redis'
import { User } from '../../user'
import { AuthenticatedEndpointFunction, LogFn } from '../../endpoint'

const startObservingObelisk: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  // The DB just knows there's a single obelisk, and doesn't distinguish between sidebar and the room
  const notes = await DB.getRoomNotes('obelisk')

  return {
    groupManagementTasks: [
      {
        userId: user.id,
        groupId: 'sidebar-obelisk',
        action: 'add'
      }
    ],
    httpResponse: {
      status: 200,
      body: { notes }
    }
  }
}

export default startObservingObelisk
