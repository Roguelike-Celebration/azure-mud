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
  var clientIdToken = req.body.token
  context.log('In Firebase, token: ' + req.body.token)

  // Apparently, the initialization persists across function calls (!?) which I didn't realize was something that
  // could happen! Clearly I don't quite understand 'serverless' (gosh I resent that term! it's still on somebody's
  // server!)
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    })
  }

  var cachedUserId = await DB.userIdForFirebaseToken(clientIdToken)
  if (cachedUserId) {
    context.res = {
      status: 200,
      body: {
        method: 'cache',
        cachedUserId: cachedUserId,
        reqBody: req.body
      }
    }
    return
  }

  // If we successfully decode the token, we want to cache it.
  await admin.auth().verifyIdToken(clientIdToken).then(async (decoded) => {
    const userId = decoded.uid

    DB.addFirebaseTokenToCache(clientIdToken, userId, decoded.exp)

    context.res = {
      status: 200,
      body: {
        decoded: decoded,
        decodedUid: userId,
        reqBody: req.body
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
