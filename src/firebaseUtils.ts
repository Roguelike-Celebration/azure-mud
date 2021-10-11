import config from './config'
import firebase from 'firebase/app'
import 'firebase/auth'

const actionCodeSettings = {
  // This URL should be changed to the frontend location for production. It must also be added to the authorized
  // domains list in the Firebase Console.
  url: window.location.href,
  // This must be true, you'll get an error if it's not.
  handleCodeInApp: true
}

export function shouldVerifyEmail (user: firebase.User): boolean {
  return user.providerData.length === 1 && user.providerData[0].providerId === 'password' && !user.emailVerified
}

export function sendSignInLinkToEmail (email: string) {
  firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings).then(() => {
    console.log(`Sign-in email sent to ${email}!`)
  })
}
