import React, { useContext } from 'react'
import { DispatchContext } from '../App'
import { AuthenticateAction, HideSideMenuAction } from '../Actions'
import config from '../config'
import firebase from 'firebase/app'
import 'firebase/auth'

export default function EmailVerifiedView () {
  const user = firebase.auth().currentUser

  if (!user.emailVerified) {
    firebase.auth().signInWithEmailLink(user.email, window.location.href).then(() => {
      // A crude way of forcing a rerender, because I don't want to go through the trouble of making an action.
      window.location.reload()
    })
  }

  if (!user.emailVerified) {
    return (
      <div>
        <header role="banner">
          <h1>Attempting to verify email.</h1>
        </header>
        <main role="main">
          <p>
            Please wait while your email is verified.
          </p>
        </main>
      </div>
    )
  } else {
    return (
      <div>
        <header role="banner">
          <h1>Your email has been successfully verified!</h1>
        </header>
        <main role="main">
          <p>
            You may now close this window and go back to the main app.
          </p>
        </main>
      </div>
    )
  }
}
