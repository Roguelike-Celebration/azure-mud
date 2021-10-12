import { User, getFullUser, isMod } from './user'
import { Context, HttpRequest } from '@azure/functions'
import { v4 as uuid } from 'uuid'
import { DB } from '../src/database'
import * as admin from 'firebase-admin'

export interface AuthenticationOptions {
  audit?: boolean
  mod?: boolean
}

/** This wraps an HTTP function and calls it with a hydrated authenticated user.
 * Returns true if execution should continue. */

export async function getUserIdFromHeaders (
  context: Context,
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

  // Gah! One thing to note - server sees all headers as all lowercase.
  if (!req.headers.authorization) {
    context.log('Authorization header not found.')
    return undefined
  }

  const authHeaderParts = req.headers.authorization.split(' ')
  // I think 'Bearer' is technically OAuth 2.0 and I don't know if that's precisely what we're using
  if (authHeaderParts.length !== 2 || authHeaderParts[0] !== 'Bearer') {
    context.log('Error authenticating auth headers: ' + req.headers.authorization + ' - were not formatted as Bearer.')
    return undefined
  }

  const clientIdToken = authHeaderParts[1]
  var cachedUserId = await DB.userIdForFirebaseToken(clientIdToken)
  if (cachedUserId) {
    return cachedUserId
  }

  return await admin.auth().verifyIdToken(clientIdToken).then(async (decoded) => {
    const userId = decoded.uid

    const userRecord = await admin.auth().getUser(userId)
    const providers = userRecord.providerData
    // If I were trying to make the API nice, I would want to return to the user that the reason was an unverified
    // email address.
    if (providers.length === 1 && providers[0].providerId === 'password' && !userRecord.emailVerified) {
      return undefined
    }

    await DB.addFirebaseTokenToCache(clientIdToken, userId, decoded.exp)
    return userId
  }).catch((error) => {
    context.log('Error authenticating token: ' + clientIdToken + ' error: ' + error)
    return undefined
  })
}

export default async function authenticate (
  context: Context,
  req: HttpRequest,
  options: AuthenticationOptions = {},
  handler: (user: User) => void
) {
  const userId = await getUserIdFromHeaders(context, req)
  if (!userId) {
    context.res = {
      status: 400,
      body: 'You did not include a user ID'
    }
    context.log('Failed to include a user ID')
    return
  }

  if (options.audit && !context.bindingDefinitions.find(def => def.name === 'tableBinding')) {
    context.res = {
      status: 501,
      body: 'Action was selected for auditing, but audit was not properly set up; action blocked until auditing configured.'
    }
    context.log('Failed to configure audit endpoint with the proper tableBinding')
    return
  }

  const user = await getFullUser(userId)

  if (options.mod) {
    if (!(await isMod(user.id))) {
      context.res = {
        status: 403,
        body: { error: 'This action requires moderator privileges.' }
      }
      return
    }
  }

  if (user.isBanned) {
    context.res = {
      status: 401,
      body: 'You are banned!'
    }
    context.log('Banned user was blocked:', user.id, user.username)
    return
  }

  const handled = await handler(user)

  if (options.audit) {
    context.bindings.tableBinding = [{
      PartitionKey: user.id,
      RowKey: uuid(),
      // The object comes loaded with a Timestamp by default as well
      userId: user.id,
      username: user.username,
      endpoint: req.url.replace('https://' + process.env.WEBSITE_HOSTNAME, ''),
      request: req.body // Assumes that all the relevant information will be in the body and not in, like...headers, or something
    }]
  }

  return handled
}
