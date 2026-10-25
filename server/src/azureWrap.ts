import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

import authenticate, { AuthenticationOptions } from './authenticate.js'
import { webPubSubOutput } from './bindings.js'
import {
  AuthenticatedEndpointFunction,
  EndpointFunction,
  isGroupMessage,
  isPrivateMessage,
  LogFn,
  Result
} from './endpoint.js'

/**
 * Each Azure Functions endpoint is basically a wrapper around an existing
 * endpoint function (in src/endpoints).
 *
 * These wrapper functions deal with Azure authentication, and then wrap all the
 * inputs/outputs nicely to work with Azure Functions + Azure SignalR Service.
 */

export async function azureWrap (
  context: InvocationContext,
  req: HttpRequest | undefined,
  fn: EndpointFunction,
  extraInputs: any = {}
): Promise<HttpResponseInit> {
  const body = req ? await readJsonBody(req) : {}
  if (body === undefined) {
    return invalidJsonResponse(context)
  }
  const result = await fn({ ...body, ...extraInputs }, logFn(context))
  return outputToAzure(context, req, result)
}

export async function authenticatedAzureWrap (
  context: InvocationContext,
  req: HttpRequest,
  fn: AuthenticatedEndpointFunction,
  opts: AuthenticationOptions = {}
): Promise<HttpResponseInit> {
  return await authenticate(context, req, opts, async (user) => {
    const body = await readJsonBody(req)
    if (body === undefined) {
      return invalidJsonResponse(context)
    }
    const result = await fn(user, body, logFn(context))
    return outputToAzure(context, req, result)
  })
}

export async function readJsonBody (request: HttpRequest): Promise<any> {
  const text = await request.text()
  if (!text) {
    // Special case for empty input, which technically isn't valid JSON, or might be undefined
    return {}
  }
  try {
    return JSON.parse(text) ?? {}
  } catch {
    return undefined
  }
}

function invalidJsonResponse (context: InvocationContext): HttpResponseInit {
  context.warn(`${context.functionName}: bad request: request body is not valid JSON`)
  return { status: 400, body: 'Request body was not valid JSON' }
}

/** Curry a Functions v4 log method (which uses its 'this') into a regular function */
function logFn (context: InvocationContext): LogFn {
  return (...args) => context.log(...args)
}

function outputToAzure (context: InvocationContext, req: HttpRequest, result: Result): HttpResponseInit {
  context.log(`outputToAzure: ${context.functionName}: ` +
    `status=${result.httpResponse?.status ?? 'none'}, ${result.messages?.length ?? 0} messages, ` +
    `${result.groupManagementTasks?.length ?? 0} group mgmt tasks`)

  if (result.messages || result.groupManagementTasks) {
    const actions: object[] = (result.messages ?? []).map((m) => {
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

    actions.push(
      ...(result.groupManagementTasks ?? []).map((t) => {
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

    context.extraOutputs.set(webPubSubOutput, actions)
  }

  return {
    status: result.httpResponse?.status || 200,
    jsonBody: result.httpResponse?.body
  }
}
