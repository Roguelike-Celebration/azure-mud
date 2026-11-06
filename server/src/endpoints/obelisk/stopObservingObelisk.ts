import { AuthenticatedEndpointFunction, LogFn } from '../../endpoint'
import { User } from '../../user'

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
