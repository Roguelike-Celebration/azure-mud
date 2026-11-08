import React, { useEffect } from 'react'

import { Action, AuthenticateAction } from '../Actions.js'
import { currentUser, sendSignInLinkToEmail, signOut } from '../authentication.js'
import Config from '../config.js'
import { State } from '../reducer.js'
import { ThunkDispatch } from '../useReducerWithThunk.js'

interface Props {
  userEmail: string;
  dispatch: ThunkDispatch<Action, State>;
}

export default function VerifyEmailView (props: Props) {
  // For some reason, this doesn't work - dispatch ends up as null. So I injected it into props. This is weird and if
  // whoever's reading this has a good explanation I'd love to hear it! -Travis
  // const dispatch = useContext(DispatchContext)
  const dispatch = props.dispatch

  // Firebase's sender for auth emails, tied to the Firebase project domain. Assumes no custom
  // sender domain has been set up in the Firebase project.
  const firebaseSenderEmail = `noreply@${Config.FIREBASE_CONFIG.projectId}.firebaseapp.com`
  // Log in automatically when user comes back to this tab after verifying email in another tab.
  useEffect(() => {
    const handleVisibilityChange = () => {
      const user = currentUser()
      if (!document.hidden && user && !user.shouldVerifyEmail) {
        dispatch(AuthenticateAction(user.id, user.id, user.providerId, false))
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [dispatch])

  const goToAuth = () => {
    signOut().then(() => {
      dispatch(AuthenticateAction(undefined, undefined, undefined, undefined))
    })
  }

  return (
    <div>
      <header role="banner">
        <div style={{ border: 'solid', borderColor: 'red' }}>
          <h1>ALERT: Please double-check your spam folder!</h1>
          <h2>Gmail has been marking our registration emails as spam, sorry!</h2>
          <p>
            A couple of people have gotten back to us saying they could not find the registration emails, but they were
            in spam, so please double-check.
          </p>
        </div>
        <h1>Please verify your email.</h1>
      </header>
      <main role="main">
        <p>
          You&apos;re currently attempting to log in as <strong>{props.userEmail}</strong>, but your email is not yet
          verified. Please follow the link in your email from {firebaseSenderEmail} to
          complete the registration process. If you don&apos;t see an email, please check your spam, since
          they&apos;ve been getting flagged by gmail.

          If you&apos;re having other difficulties logging in or entering the space, please email us at
          contact@roguelike.club. Thanks!
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
  )
}
