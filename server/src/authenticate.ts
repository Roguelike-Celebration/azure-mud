import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import admin from 'firebase-admin'

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
  // Apparently, the initialization persists across function calls (!?) which I didn't realize was something that
  // could happen! Clearly I don't quite understand 'serverless' (gosh I resent that term! it's still on somebody's
  // server!)
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
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
    context.log(`Error authenticating auth header: header not formatted as Bearer: "${authHeader}`)
    return undefined
  }

  const clientIdToken = authHeaderParts[1]
  var cachedUserId = await DB.userIdForFirebaseToken(clientIdToken)
  if (cachedUserId) {
    return cachedUserId
  }

  return await admin
    .auth()
    .verifyIdToken(clientIdToken)
    .then(async (decoded) => {
      const userId = decoded.uid

      const userRecord = await admin.auth().getUser(userId)
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
      context.log('Error authenticating token: ' + clientIdToken + ' error: ' + error)
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
