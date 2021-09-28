import React, { useContext } from 'react'
import { DispatchContext } from '../App'
import { AuthenticateAction, HideSideMenuAction } from '../Actions'
import config from '../config'
import firebase from 'firebase/app'
import 'firebase/auth'

interface Props {
  userEmail: string;
  dispatch: any;
}

const actionCodeSettings = {
  // URL must be in the authorized domains list in the Firebase Console.
  // TODO: Implement this, lol
  url: `${config}/api/verifyEmail`,
  // This must be true.
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
          verified. Please check your email!
        </p>
        <button
          onClick={(e) => {
            firebase.auth().sendSignInLinkToEmail(props.userEmail, actionCodeSettings).then(() => {
              console.log('You clicked the button')
            })
          }}>
            Resend Verification Email
        </button>
        <br/>
        <button onClick={goToAuth}>
            Use a Different Email/Provider
        </button>
      </main>
    </div>
  )
}
