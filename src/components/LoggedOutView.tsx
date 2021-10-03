// Note - we're doing firebase 8 because the firebaseui stuff doesn't work with 9, big F
import { shouldVerifyEmail, sendSignInLinkToEmail } from '../firebaseUtils'
import firebase from 'firebase/app'
import 'firebase/auth'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import React from 'react'

const uiConfig = {
  callbacks: {
    // The documentation on the firebaseui README appears somewhat borked at time of writing; the structure of
    // AuthResult doesn't line up with itself! If you go back to that README treat it with caution.
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      const user = firebase.auth().currentUser
      if (shouldVerifyEmail(user)) {
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
        {(window as any).safari
          ? <p>
            <strong style={{ color: 'red' }}> You appear to be using Safari.</strong> <br/>
            If you are having difficulty logging in, you may need to allow third-party cookies
            <ul>
              <li>On macOS, Safari -&gt; Preferences -&gt; uncheck "Prevent cross-site tracking"</li>
              <li>On iOS, Settings -&gt; Safari -&gt; uncheck "Prevent cross-site tracking"</li>
            </ul>
            We know this is sketchy! We promise we're not capturing or selling data to any third party, it's just a limitation of the way we're handling logins.<br/>
            If you're not comfortable with this, feel free to switch to Chrome, Firefox, or another non-Safari browser on your Mac.
          </p> : null
        }
        <p>
          If you use email, we will require you to authenticate the email.
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
