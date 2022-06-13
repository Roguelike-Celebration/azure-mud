// Note - we're doing firebase 8 because the firebaseui stuff doesn't work with 9, big F
import { currentUser, sendSignInLinkToEmail } from '../../authentication'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'

const uiConfig = {
  callbacks: {
    // The documentation on the firebaseui README appears somewhat borked at time of writing; the structure of
    // AuthResult doesn't line up with itself! If you go back to that README treat it with caution.
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      const user = currentUser()
      if (user.shouldVerifyEmail) {
        sendSignInLinkToEmail(user.email)
      }
      window.location.reload()
      return false
    }
  },
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID
  ]
}

export default function LoggedOutView () {
  return (
    <div>
      <header role="banner">
        <h1>Welcome to the secret Roguelike Celebration backstage area!</h1>
      </header>
      <main role="main">
        <p>
          If you&apos;re not a Roguelike Celebration admin, this isn&apos;t for you. If you should be an admin, but can&apos;t log in, ask in our other chat.
        </p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </main>
    </div>
  )
}
