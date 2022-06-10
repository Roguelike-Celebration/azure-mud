import React, { useEffect, createContext } from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-solarized_dark'
import 'ace-builds/src-noconflict/ext-language_tools'

import { onAuthenticationStateChange, signOut } from '../../authentication'
import { checkIsRegistered, getRoomIds } from '../../networking'
import reducer, { defaultState, State } from '../reducer'
import { useReducerWithThunk } from '../../useReducerWithThunk'
import { Action, LoggedInAction, UpdateRoomIds } from '../actions'
import LoggedOutView from './LoggedOutView'
import RoomList from './RoomList'

export const DispatchContext = createContext(null)

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

  // This could probably previously run in the login useEffect block--
  // this is gated on firebase.auth() being valid, not state.isLoggedIn
  // Shrug.
  useEffect(() => {
    if (!state.isLoggedIn) return
    (async () => {
      const roomIds = await getRoomIds()
      dispatch(UpdateRoomIds(roomIds))
    })()
  }, [state.isLoggedIn])

  if (state.isLoggedIn) {
    return (
      <DispatchContext.Provider value={dispatch}>
        <div>
          <h1>Room Editor:  {state.displayedRoomId || 'no room selected'}</h1>
          <RoomList roomIds={state.roomIds}/>
          <AceEditor
            mode="json"
            theme="solarized_dark"
            name="editor"
            editorProps={{ $blockScrolling: true }}
            wrapEnabled={true}
            width={'70vw'}
            value={JSON.stringify(state.roomData[state.displayedRoomId] || '', null, 2)}
          />
        </div>
      </DispatchContext.Provider>
    )
  } else {
    return <LoggedOutView />
  }
}

export default App
