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
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID
  ]
}

export default function LoggedOutView () {
  return (
    <div>
      <header role="banner">
        <h1>Welcome to Roguelike Celebration 2021!</h1>
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
          If you log in via email, we will require you to verify that email address.
        </p>
        <p>
          No matter which service you log in with, we do not access any data
          other than what is needed to authenticate you. If it would make you
          more comfortable, feel free to sign up for and use a throwaway
          account on one of these services.
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
