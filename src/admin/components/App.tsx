import React, { useEffect } from 'react'
import { onAuthenticationStateChange, signOut } from '../../authentication'
import { checkIsRegistered } from '../../networking'
import reducer, { defaultState, State } from '../reducer'
import { useReducerWithThunk } from '../../useReducerWithThunk'
import { Action, LoggedInAction } from '../actions'

import LoggedOutView from './LoggedOutView'

const App = function () {
  const [state, dispatch] = useReducerWithThunk<Action, State>(
    reducer,
    defaultState
  )
  console.log('In app', state)

  useEffect(() => {
    // Auth is simple: you log in, we check if you're a mod, and only set the 'logged in' flag if so
    // I don't think we (currently) care about knowing WHO you are, or connecting to SignalR infra
    // SignalR may change if we want to enable real-time collab, but WOOF.

    onAuthenticationStateChange(async (user) => {
      // The shouldVerifyEmail check shouldn't be necessary,
      // but I'm not convinced we won't have an exploit where someone can make a new account with an existing admin email.
      // This 20 characters is easier to type than manually testing.
      if (!user || user.shouldVerifyEmail) {
        return
      }

      const { isMod, isBanned } = await checkIsRegistered()

      if (isMod && !isBanned) {
        dispatch(LoggedInAction())
      } else {
        alert("You shouldn't have access to this page.")
        await signOut()
        window.location.reload()
      }
    })
  }, [])

  if (state.isLoggedIn) {
    return <div>Hello admin!</div>
  } else {
    return <LoggedOutView />
  }
}

export default App
