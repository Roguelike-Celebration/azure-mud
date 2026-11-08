import { MinimalUser } from '../server/src/user.js'

// Type-only import to avoid actually running reducer.ts, which calls Firebase initialization at
// module load time. Conflicts with other code (like the admin app) that also initializes Firebase.
import type { State } from './reducer.js'

/** Logged-in user's ID, required, for code that only runs after login. Throws otherwise.
 *  Reducer event handlers must not use this, because events can arrive before login finishes. */
export function myUserId (state: State): string {
  if (!state.userId) {
    throw new Error('No userId in State: not logged in yet')
  }
  return state.userId
}

/** Logged-in user's MinimalUser, required, for code that only runs after login. Throws otherwise.
 *  Reducer event handlers must not use this, because events can arrive before login finishes. */
export function myUser (state: State): MinimalUser {
  const user = state.userMap[myUserId(state)]
  if (!user) {
    throw new Error("No MinimalUser entry (in State's userMap) for logged-in user")
  }
  return user
}
