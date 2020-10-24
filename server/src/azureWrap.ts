import { Context, HttpRequest } from '@azure/functions'
import authenticate, { AuthenticationOptions } from './authenticate'
import { EndpointFunction, AuthenticatedEndpointFunction, Result, isGroupMessage, isPrivateMessage } from './endpoint'

/**
 * Each Azure Functions endpoint is basically a wrapper around an existing
 * endpoint function (in src/endpoints).
 *
 * These wrapper functions deal with Azure authentication, and then wrap all the
 * inputs/outputs nicely to work with Azure Functions + Azure SignalR Service.
 */

export async function azureWrap (context: Context, req: HttpRequest|undefined, fn: EndpointFunction, extraInputs: any = {}) {
  const result = await fn({ ...((req && req.body) || {}), ...extraInputs }, context.log)
  outputToAzure(context, req, result)
}

export async function authenticatedAzureWrap (context: Context, req: HttpRequest, fn: AuthenticatedEndpointFunction, opts: AuthenticationOptions = {}) {
  await authenticate(context, req, opts, async (user) => {
    const result = await fn(user, req.body || {}, context.log)
    outputToAzure(context, req, result)
  })
}

function outputToAzure (context: Context, req: HttpRequest, result: Result) {
  if (result.messages) {
    context.bindings.signalRMessages = result.messages.map(m => {
      if (isPrivateMessage(m)) {
        return {
          userId: m.userId,
          target: m.target,
          arguments: m.arguments
        }
      } else if (isGroupMessage(m)) {
        return {
          groupId: m.groupName,
          target: m.target,
          arguments: m.arguments
        }
      } else {
        return {
          target: m.target,
          arguments: m.arguments
        }
      }
    })
  }

  if (result.groupManagementTasks) {
    context.bindings.signalRGroupActions = result.groupManagementTasks.map(t => {
    // TODO: Azure SignalR Service doesn't support a 'removeAll' action, but it would make sense to implement ourselves
      return {
        userId: t.userId,
        groupName: t.groupId,
        action: t.action
      }
    })
  }

  // TimerTriggers don't have a res obj. This seems like an okay, if imperfect, guard.
  if (context.res) {
    context.res.status = (result.httpResponse && result.httpResponse.status) || 200
    context.res.body = result.httpResponse && JSON.stringify(result.httpResponse.body)
  }
}
