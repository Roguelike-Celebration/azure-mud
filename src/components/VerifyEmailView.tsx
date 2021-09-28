import React, { useContext } from 'react'
import { DispatchContext } from '../App'
import { AuthenticateAction, HideSideMenuAction } from '../Actions'
import firebase from 'firebase/app'
import 'firebase/auth'

interface Props {
  userEmail: string;
  dispatch: any;
}

const actionCodeSettings = {
  // This URL should be changed to the frontend location for production. It must also be added to the authorized
  // domains list in the Firebase Console.
  url: 'http://localhost:1234',
  // This must be true, you'll get an error if it's not.
  handleCodeInApp: true
};

export default function VerifyEmailView (props: Props) {
  // For some reason, this doesn't work - dispatch ends up as null. So I injected it into props. This is weird and if
  // whoever's reading this has a good explanation I'd love to hear it! -Travis
  // const dispatch = useContext(DispatchContext)
  const dispatch = props.dispatch

  const goToAuth = () => {
    firebase.auth().signOut().then(() => {
      dispatch(AuthenticateAction(undefined, undefined, undefined, undefined))
    })
  }

  return (
    <div>
      <header role="banner">
        <h1>Please verify your email!</h1>
      </header>
      <main role="main">
        <p>
          You're currently attempting to log in as <strong>{props.userEmail}</strong>, but your email is not yet
          verified. Please follow the link in your email to complete the registration process.
        </p>
        <button
          onClick={(e) => {
            firebase.auth().sendSignInLinkToEmail(props.userEmail, actionCodeSettings).then(() => {
              console.log('Sending a sign-in email!')
            })
          }}>
            Resend Verification Email
        </button>
        <br/>
        <button onClick={goToAuth}>
            Use a Different Provider or Email
        </button>
      </main>
    </div>
  )
}
