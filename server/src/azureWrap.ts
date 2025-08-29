import { Context, HttpRequest } from '@azure/functions'
import authenticate, { AuthenticationOptions } from './authenticate'
import {
  EndpointFunction,
  AuthenticatedEndpointFunction,
  Result,
  isGroupMessage,
  isPrivateMessage
} from './endpoint'

/**
 * Each Azure Functions endpoint is basically a wrapper around an existing
 * endpoint function (in src/endpoints).
 *
 * These wrapper functions deal with Azure authentication, and then wrap all the
 * inputs/outputs nicely to work with Azure Functions + Azure SignalR Service.
 */

export async function azureWrap (
  context: Context,
  req: HttpRequest | undefined,
  fn: EndpointFunction,
  extraInputs: any = {}
) {
  const result = await fn(
    { ...((req && req.body) || {}), ...extraInputs },
    context.log
  )
  outputToAzure(context, req, result)
}

export async function authenticatedAzureWrap (
  context: Context,
  req: HttpRequest,
  fn: AuthenticatedEndpointFunction,
  opts: AuthenticationOptions = {}
) {
  await authenticate(context, req, opts, async (user) => {
    const result = await fn(user, req.body || {}, context.log)
    outputToAzure(context, req, result)
  })
}

function outputToAzure (context: Context, req: HttpRequest, result: Result) {
  context.log('outputting to azure')
  context.log('context: ', JSON.stringify(context))
  context.log('result: ', JSON.stringify(result))
  if (result.messages) {
    context.bindings.actions = result.messages.map((m) => {
      const actionJson = JSON.stringify({ type: m.target, value: m.arguments })
      if (isPrivateMessage(m)) {
        return {
          actionName: 'sendToUser',
          userId: m.userId,
          data: actionJson,
          dataType: 'text'
        }
      } else if (isGroupMessage(m)) {
        return {
          actionName: 'sendToGroup',
          group: m.groupId,
          data: actionJson,
          dataType: 'text'
        }
      } else {
        return {
          actionName: 'sendToAll',
          data: actionJson,
          dataType: 'text'
        }
      }
    })
  }

  if (result.groupManagementTasks) {
    if (!context.bindings.actions) { context.bindings.actions = [] }

    context.bindings.actions.push(
      ...result.groupManagementTasks.map((t) => {
        // PubSub has a 'RemoveUserFromAllGroups' action we can eventually use here
        // GroupManagementTasks has a "removeAll" option we don't currently use in favor of "setUpRoomsFor user"
        // It's only called from 'connect'.
        // We'd want make connect return a 'removeAll' and then an 'add' for the current room
        // If we need to persist the SignalR path, this file can call Redis to find room IDs
        let actionName = ''
        if (t.action === 'add') actionName = 'addUserToGroup'
        if (t.action === 'remove') actionName = 'removeUserFromGroup'
        return {
          actionName,
          userId: t.userId,
          group: t.groupId
        }
      })
    )
  }

  console.log('actions', JSON.stringify(context.bindings.actions))

  // TimerTriggers don't have a res obj. This seems like an okay, if imperfect, guard.
  if (context.res) {
    context.res.status =
      (result.httpResponse && result.httpResponse.status) || 200
    context.res.body =
      result.httpResponse && JSON.stringify(result.httpResponse.body)
  }
}
