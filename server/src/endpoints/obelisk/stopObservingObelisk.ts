import { AuthenticatedEndpointFunction, LogFn } from '../../endpoint.js'
import { User } from '../../user.js'

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
