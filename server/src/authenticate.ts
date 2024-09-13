import { User, getFullUser, isMod } from './user'
import { Context, HttpRequest } from '@azure/functions'
import enp from 'easy-no-password'

export interface AuthenticationOptions {
  audit?: boolean;
  mod?: boolean;
}

/** This wraps an HTTP function and calls it with a hydrated authenticated user.
 * Returns true if execution should continue. */
// TODO: This is Azure-specific
export default async function authenticate (
  context: Context,
  req: HttpRequest,
  options: AuthenticationOptions = {},
  handler: (user: User) => void
) {
  const userId = await getUserIdFromHeaders(req.headers, context.log)
  if (!userId) {
    context.res = {
      status: 400,
      body: 'You did not include a valid user ID and token'
    }
    context.log('Failed to include a user ID and token')
    return
  }

  if (
    options.audit &&
    !context.bindingDefinitions.find((def) => def.name === 'tableBinding')
  ) {
    context.res = {
      status: 501,
      body: 'Action was selected for auditing, but audit was not properly set up; action blocked until auditing configured.'
    }
    context.log(
      'Failed to configure audit endpoint with the proper tableBinding'
    )
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

  // TODO: Restore or trash
  // This is commented out because the upgrade from Functions 3 -> 4 broke something, somehow
  // if (options.audit) {
  //   context.log(`Auditing for user '${user.id}'`);
  //   context.bindings.tableBinding = [
  //     {
  //       PartitionKey: user.id,
  //       RowKey: uuid(),
  //       // The object comes loaded with a Timestamp by default as well
  //       userId: user.id,
  //       username: user.username,
  //       endpoint: req.url.replace(
  //         "https://" + process.env.WEBSITE_HOSTNAME,
  //         ""
  //       ),
  //       request: req.body, // Assumes that all the relevant information will be in the body and not in, like...headers, or something
  //     },
  //   ];
  // }

  return handled
}

/** This takes in a header object containing an OAuth2-like Bearer token and a userID, and returns either the userID of the valid user or undefined if the pair is invalid */
export async function getUserIdFromHeaders (
  headers: any,
  log: Function,
): Promise<string | undefined> {
  // Gah! One thing to note - server sees all headers as all lowercase.
  if (!headers.authorization) {
    log('Authorization header not found.')
    return undefined
  }

  const authHeaderParts = headers.authorization.split(' ')
  // Using a Bearer header like this is an OAuth2 thing. We're not using OAuth.
  // We can change this if need be, but it seems ~fine~.
  if (authHeaderParts.length !== 2 || authHeaderParts[0] !== 'Bearer') {
    log(
      'Error authenticating auth headers: ' +
        headers.authorization +
        ' - were not formatted as Bearer.'
    )
    return undefined
  }

  if (!headers.userId) {
    log('User ID header not found.')
    return undefined
  }

  const clientIdToken = authHeaderParts[1]
  var userId = headers.userId

  return new Promise((resolve, reject) => {
    enp.isValid(clientIdToken, userId, (err, isValid) => {
      if (err) {
        log('Error validating token:', err)
        reject(err)
      }
      if (!isValid) {
        log('Token is not valid.')
        reject(undefined)
      }

      resolve(userId)
    })
  })
}

