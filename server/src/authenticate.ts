import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

import { DB } from '../src/database.js'

import { auditLogOutput } from './bindings.js'
import { getFullUser, isMod, User } from './user.js'

export interface AuthenticationOptions {
  doAudit?: boolean;
  needsMod?: boolean;
}

export async function getUserIdFromHeaders (
  context: InvocationContext,
  req: HttpRequest
): Promise<string | undefined> {
  // AzFn workers can be reused across function calls, and their module state persists in
  // that case, so the app might already be initialized, though it is not guaranteed. -apj
  // See: https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node?pivots=nodejs-model-v4#programming-model
  if (getApps().length === 0) {
    initializeApp({
      credential: applicationDefault()
    })
  }

  // Header names are case-insensitive if you use headers.get()
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    context.log('Authorization header not found.')
    return undefined
  }

  const authHeaderParts = authHeader.split(' ')
  // I think 'Bearer' is technically OAuth 2.0 and I don't know if that's precisely what we're using
  if (authHeaderParts.length !== 2 || authHeaderParts[0] !== 'Bearer') {
    // Don't log full header - might still contain a token. Redact it. First 20 chars should be safe
    // even if scheme is missing and first word is a token; a JWT's leading 20 chars are just a header.
    const shortScheme = authHeaderParts[0].slice(0, 20)
    context.log('Error authenticating auth header: header not formatted as Bearer: ' +
      'scheme "%s", %d parts, length %d chars', shortScheme, authHeaderParts.length, authHeader.length)
    return undefined
  }

  const clientIdToken = authHeaderParts[1]
  var cachedUserId = await DB.userIdForFirebaseToken(clientIdToken)
  if (cachedUserId) {
    return cachedUserId
  }

  return await getAuth()
    .verifyIdToken(clientIdToken)
    .then(async (decoded) => {
      const userId = decoded.uid

      const userRecord = await getAuth().getUser(userId)
      const providers = userRecord.providerData
      // If I were trying to make the API nice, I would want to return to the user that the reason was an unverified
      // email address.
      if (
        providers.length === 1 &&
        providers[0].providerId === 'password' &&
        !userRecord.emailVerified
      ) {
        return undefined
      }

      await DB.addFirebaseTokenToCache(clientIdToken, userId, decoded.exp)
      return userId
    })
    .catch((error): undefined => {
      // Don't log token in plaintext; just summarize, with characteristic suffix
      context.log('Error authenticating token: "...%s" (length %d): %s',
        clientIdToken.slice(-6), clientIdToken.length, String(error))
      return undefined
    })
}

export default async function authenticate (
  context: InvocationContext,
  req: HttpRequest,
  options: AuthenticationOptions = {},
  handler: (user: User) => Promise<HttpResponseInit>
): Promise<HttpResponseInit> {
  const userId = await getUserIdFromHeaders(context, req)
  if (!userId) {
    context.log('Failed to include a user ID in authenticate() call')
    return {
      status: 400,
      body: 'You did not include a user ID'
    }
  }

  if (
    options.doAudit &&
    !context.options.extraOutputs.some((out) => out.name === auditLogOutput.name)
  ) {
    context.log('Failed to configure audit endpoint with the proper tableBinding')
    return {
      status: 501,
      body: 'Action was selected for auditing, but audit was not properly set up; action blocked until auditing configured.'
    }
  }

  const user = await getFullUser(userId)

  if (!user) {
    return {
      status: 404,
      jsonBody: { error: `User not found: id ${userId}` }
    }
  }

  if (options.needsMod) {
    if (!(await isMod(user.id))) {
      return {
        status: 403,
        jsonBody: { error: 'This action requires moderator privileges.' }
      }
    }
  }

  if (user.isBanned) {
    context.log('Banned user was blocked:', user.id, user.username)
    return {
      status: 401,
      body: 'You are banned!'
    }
  }

  return await handler(user)
}
