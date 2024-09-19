import React, { useEffect, createContext, useRef } from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-solarized_dark'
import 'ace-builds/src-noconflict/ext-language_tools'

import { checkIsRegistered, configureNetworking, getRoomIds, updateRoom } from '../../networking'
import reducer, { defaultState, State } from '../reducer'
import { useReducerWithThunk } from '../../useReducerWithThunk'
import { Action, LoggedInAction, UpdateRoomIds, UpdateAndShowRoomAction } from '../actions'
import LoggedOutView from './LoggedOutView'
import RoomList from './RoomList'
import RoomOptionsView from './RoomOptionsView'

import { getToken } from '../../storage'

export const DispatchContext = createContext(null)

const App = function () {
  const aceRef = useRef(null)

  const [state, dispatch] = useReducerWithThunk<Action, State>(
    reducer,
    defaultState
  )
  console.log('In app', state)

  useEffect(() => {
    // Auth is simple: you log in, we check if you're a mod, and only set the 'logged in' flag if so
    // I don't think we (currently) care about knowing WHO you are, or connecting to SignalR infra
    // SignalR may change if we want to enable real-time collab, but WOOF.
    //
    // This is leaky in that you can see the editing tools if you simply spoof a valid userId, 
    // but any edits you make will fail anyway, so shrug

    (async () => {
    const tokenObj = await getToken()
      console.log(tokenObj)
      if (!tokenObj || !tokenObj.userId || !tokenObj.token) {
        // logged out
        console.log("no token found")
        return
      }

      const { userId, token } = tokenObj

      
      const { isMod, isBanned } = await checkIsRegistered(userId)

      if (isMod && !isBanned) {
        dispatch(LoggedInAction())
        configureNetworking(userId, token, dispatch)
      }
    })()
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

  const saveRoom = () => {
    const code = aceRef.current.editor.getValue()
    updateRoom(state.displayedRoomId, JSON.parse(code))
  }

  const createRoom = (name: string) => {
    dispatch(UpdateAndShowRoomAction(name, { displayName: name, shortName: name, id: name, description: '' }))
  }

  if (state.isLoggedIn) {
    return (
      <DispatchContext.Provider value={dispatch}>
        <div>
          <h1>Room Editor:  {state.displayedRoomId || 'no room selected'}</h1>
          <RoomOptionsView roomId={state.displayedRoomId} updateRoom={saveRoom} createRoom={createRoom}/>
          <RoomList roomIds={state.roomIds}/>
          <AceEditor
            mode="json"
            theme="solarized_dark"
            name="editor"
            editorProps={{ $blockScrolling: true }}
            height={'100%'}
            ref={aceRef}
            value={JSON.stringify(state.roomData[state.displayedRoomId] || '', null, 2)}
            wrapEnabled={true}
            width={'70vw'}
          />
        </div>
      </DispatchContext.Provider>
    )
  } else {
    return <LoggedOutView />
  }
}

export default App
