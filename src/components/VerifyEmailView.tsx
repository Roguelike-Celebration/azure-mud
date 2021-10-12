import React from 'react'
import PageVisibility from 'react-page-visibility'
import { AuthenticateAction } from '../Actions'
import { sendSignInLinkToEmail } from '../firebaseUtils'
import firebase from 'firebase/app'
import 'firebase/auth'

interface Props {
  userEmail: string;
  dispatch: any;
}

export default function VerifyEmailView (props: Props) {
  // For some reason, this doesn't work - dispatch ends up as null. So I injected it into props. This is weird and if
  // whoever's reading this has a good explanation I'd love to hear it! -Travis
  // const dispatch = useContext(DispatchContext)
  const dispatch = props.dispatch

  const handleVisibilityChange = (visibility) => {
    if (visibility && firebase.auth().currentUser && firebase.auth().currentUser.emailVerified) {
      var user = firebase.auth().currentUser
      dispatch(AuthenticateAction(user.uid, user.email, user.providerId, false))
    }
  }

  const goToAuth = () => {
    firebase.auth().signOut().then(() => {
      dispatch(AuthenticateAction(undefined, undefined, undefined, undefined))
    })
  }

  return (
    <PageVisibility onChange={handleVisibilityChange}>
      <div>
        <header role="banner">
          <h1>Please verify your email!</h1>
        </header>
        <main role="main">
          <p>
            You&apos;re currently attempting to log in as <strong>{props.userEmail}</strong>, but your email is not yet
            verified. Please follow the link in your email to complete the registration process.
          </p>
          <p>
            <strong>If you have verified your email and this page has not automatically logged you in, please refresh
              the page manually.</strong>
          </p>
          <button
            onClick={(e) => {
              sendSignInLinkToEmail(props.userEmail)
            }}>
              Resend Verification Email
          </button>
          <br/>
          <button onClick={goToAuth}>
              Use a Different Provider or Email
          </button>
        </main>
      </div>
    </PageVisibility>
  )
}
