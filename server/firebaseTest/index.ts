import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { getFullUser, User } from '../src/user'
import { DB } from '../src/database'
import * as admin from 'firebase-admin'

// TODO: write up that you need to generate firebase key json & store it & set the GOOGLE_APPLICATION_CREDENTIALS
// env var as per https://firebase.google.com/docs/admin/setup#linux-or-macos
// Then, when you get the file, stick it in `firebase-admin.json` in the `/server` project directory.
// Therefore:
// GOOGLE_APPLICATION_CREDENTIALS = ./firebase-admin.json

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
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
    context.res = {
      status: 401,
      body: req.headers
    }
    return
  }

  const authHeaderParts = req.headers.authorization.split(' ')

  // I think 'Bearer' is technically OAuth 2.0 and I don't know if that's precisely what we're using
  if (authHeaderParts.length !== 2 || authHeaderParts[0] !== 'Bearer') {
    context.res = {
      status: 400,
      body: {
        error: 'Auth must be of type Bearer & be properly formatted.'
      }
    }
    return
  }

  const clientIdToken = authHeaderParts[1]

  var cachedUserId = await DB.userIdForFirebaseToken(clientIdToken)
  if (cachedUserId) {
    context.res = {
      status: 200,
      body: {
        method: 'cache',
        userId: cachedUserId
      }
    }
    return
  }

  await admin.auth().verifyIdToken(clientIdToken).then(async (decoded) => {
    const userId = decoded.uid

    await DB.addFirebaseTokenToCache(clientIdToken, userId, decoded.exp)

    context.res = {
      status: 200,
      body: {
        method: 'decoded',
        userId: userId
      }
    }
  }).catch((error) => {
    context.log('Error authenticating token: ' + clientIdToken + ' error: ' + error)
    context.res = {
      status: 400,
      body: {
        description: 'Token could not be authenticated!'
      }
    }
  })
}

export default httpTrigger
