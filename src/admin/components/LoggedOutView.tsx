// Note - we're doing firebase 8 because the firebaseui stuff doesn't work with 9, big F
import firebase from 'firebase/app'
import React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

import 'firebase/auth'

import { firebaseUiConfig } from '../../authentication.js'

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
        <StyledFirebaseAuth uiConfig={firebaseUiConfig} firebaseAuth={firebase.auth()} />
      </main>
    </div>
  )
}
