// Note - we're doing firebase 8 because the firebaseui stuff doesn't work with 9, big F
import { currentUser, sendSignInLinkToEmail } from '../authentication'
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
      return true
    }
  },
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ]
}

export default function LoggedOutView () {
  const thisYear: string = `${(new Date()).getFullYear()}`

  return (
    <div>
      <header role="banner">
        <h1>Welcome to Roguelike Celebration {thisYear}!</h1>
      </header>
      <main role="main">
        <p>
          This is a social space for attendees of{' '}
          <a href='https://roguelike.club'>Roguelike Celebration</a>, a
          community-generated weekend of talks, games, and conversations about
          roguelikes and related topics, including procedural generation and
          game design. It&apos;s for fans, players, developers, scholars, and
          everyone else!
        </p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        <p>
          <strong>We no longer support signing in with any form other than email.</strong> We&apos;re sorry if you used
          one of the third-party sign-ons in previous years. If you sign in using the same email you used for Twitter
          or Google, you should be able to recover your account (it will ask you to reset your password) - otherwise,
          please make a new account.
        </p>
        <p>
          If you sign up for a new account, we will require you to verify that email address.
        </p>
        <p>
          After logging in, you will have the opportunity to pick whatever chat handle you would
          like before entering the space.
        </p>
        <p>
          By entering the space, you agree to our{' '}
          <a href={'https://roguelike.club/code.html'}>Code of Conduct</a>.
        </p>
      </main>
    </div>
  )
}
