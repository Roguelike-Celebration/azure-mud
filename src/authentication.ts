import firebase from 'firebase/app'
import 'firebase/auth'

export function onAuthenticationStateChange (handler: (user: AuthenticatedUser) => void) {
  firebase.auth().onAuthStateChanged((fbUser: firebase.User) => {
    const user = firebaseUserToAuthenticatedUser(fbUser)
    handler(user)
  })
}

interface AuthenticatedUser {
  displayName: string
  id: string
  email: string
  providerId: string,
  shouldVerifyEmail: boolean,
  isSignInWithEmailLink: (location: string) => boolean

  // TODO: We use this property in VerifyEmailView.
  // I'm not sure if we should just be naively threading it through alongside our
  // shouldVerifyEmail logic, or if there's a smarter way to unify things
  emailVerified: boolean,
}

export function currentUser (): AuthenticatedUser {
  return firebaseUserToAuthenticatedUser(firebase.auth().currentUser)
}

export function signOut (): Promise<void> {
  return firebase.auth().signOut()
}

const firebaseUserToAuthenticatedUser = (fb: firebase.User): AuthenticatedUser | undefined => {
  if (!fb) return undefined

  const shouldVerifyEmail = fb.providerData &&
    fb.providerData.length === 1 &&
    fb.providerData[0].providerId === 'password' &&
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

export function sendSignInLinkToEmail (email: string) {
  const actionCodeSettings = {
    // This URL should be changed to the frontend location for production. It must also be added to the authorized
    // domains list in the Firebase Console.
    url: window.location.href,
    // This must be true, you'll get an error if it's not.
    handleCodeInApp: true
  }

  firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings).then(() => {
    console.log(`Sign-in email sent to ${email}!`)
  })
}
