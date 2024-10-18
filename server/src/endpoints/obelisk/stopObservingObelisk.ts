import { User } from '../../user'
import { AuthenticatedEndpointFunction, LogFn } from '../../endpoint'

const stopObservingObelisk: AuthenticatedEndpointFunction = async (user: User, inputs: any, log: LogFn) => {
  return {
    groupManagementTasks: [
      {
        userId: user.id,
        groupId: 'sidebar-obelisk',
        action: 'remove'
      }
    ],
    httpResponse: {
      status: 200
    }
  }
}

export default stopObservingObelisk
