import firebase from 'firebase/app'
import 'firebase/auth'
import type firebaseui from 'firebaseui'

export function onAuthenticationStateChange (handler: (user: AuthenticatedUser | undefined) => void): void {
  firebase.auth().onAuthStateChanged((fbUser: firebase.User | null) => {
    const user = firebaseUserToAuthenticatedUser(fbUser)
    handler(user)
  })
}

interface AuthenticatedUser {
  displayName: string | null
  id: string
  email: string | null
  providerId: string,
  shouldVerifyEmail: boolean,
  isSignInWithEmailLink: (location: string) => boolean

  // TODO: We use this property in VerifyEmailView.
  // I'm not sure if we should just be naively threading it through alongside our
  // shouldVerifyEmail logic, or if there's a smarter way to unify things
  emailVerified: boolean,
}

export function currentUser (): AuthenticatedUser | undefined {
  return firebaseUserToAuthenticatedUser(firebase.auth().currentUser)
}

/** The logged-in user, required. Throws if undefined. For use in code that only runs when
 * user is logged in. */
export function getRequiredCurrentUser (): AuthenticatedUser {
  const user = currentUser()
  if (!user) {
    throw new Error('No logged-in Firebase user')
  }
  return user
}

export function signOut (): Promise<void> {
  return firebase.auth().signOut()
}

const firebaseUserToAuthenticatedUser = (fb: firebase.User | null): AuthenticatedUser | undefined => {
  if (!fb) return undefined

  const shouldVerifyEmail = fb.providerData &&
    fb.providerData.length === 1 &&
    fb.providerData[0]?.providerId === 'password' &&
    !fb.emailVerified

  return {
    id: fb.uid,
    displayName: fb.displayName,
    email: fb.email,
    emailVerified: fb.emailVerified,
    providerId: fb.providerId,
    shouldVerifyEmail,
    isSignInWithEmailLink: (location: string) => {
      return firebase.auth().isSignInWithEmailLink(location)
    }
  }
}

export function sendSignInLinkToEmail (email: string): void {
  const url = window.location.href
  const actionCodeSettings = {
    // This URL should be changed to the frontend location for production. It must also be added to the authorized
    // domains list in the Firebase Console.
    url: url,
    // This must be true, you'll get an error if it's not.
    handleCodeInApp: true
  }

  firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings).then(() => {
    console.log(`Sign-in email sent to ${email}! URL=${url}`)
  })
}

export const firebaseUiConfig: firebaseui.auth.Config = {
  callbacks: {
    // The documentation on the firebaseui README appears somewhat borked at time of writing; the structure of
    // AuthResult doesn't line up with itself! If you go back to that README treat it with caution.
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      const user = getRequiredCurrentUser()
      if (user.shouldVerifyEmail && user.email) {
        sendSignInLinkToEmail(user.email)
      }
      // false = don't redirect. We don't use sign-in redirect URLs, so returning true just causes
      // the firebase widget to show a "No redirect URL has been found" error message.
      return false
    }
  },
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ]
}
