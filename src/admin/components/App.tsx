import React, { createContext, useEffect, useRef } from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-solarized_dark'
import 'ace-builds/src-noconflict/ext-language_tools'

import { onAuthenticationStateChange, signOut } from '../../authentication.js'
import { checkIsRegistered, getAllRooms, updateRoom } from '../../networking.js'
import { Room } from '../../room.js'
import { ThunkDispatch, useReducerWithThunk } from '../../useReducerWithThunk.js'
import { Action, LoggedInAction, LoggedOutAction, UpdateAllRoomsAction, UpdateAndShowRoomAction } from '../actions.js'
import reducer, { defaultState, State } from '../reducer.js'

import LoggedOutView from './LoggedOutView.js'
import RoomList from './RoomList.js'
import RoomOptionsView from './RoomOptionsView.js'

/** Placeholder default for a context with no meaningful value. */
const noDefault = <T,>(): T => null as unknown as T

// No meaningful default
export const DispatchContext = createContext<ThunkDispatch<Action, State>>(noDefault())

const App = function () {
  const aceRef = useRef<AceEditor>(null)

  const [state, dispatch] = useReducerWithThunk<Action, State>(
    reducer,
    defaultState
  )

  useEffect(() => {
    // Auth is simple: you log in, we check if you're a mod, and only set the 'logged in' flag if so
    // I don't think we (currently) care about knowing WHO you are, or connecting to SignalR infra
    // SignalR may change if we want to enable real-time collab, but WOOF.

    return onAuthenticationStateChange(async (user) => {
      // The shouldVerifyEmail check shouldn't be necessary,
      // but I'm not convinced we won't have an exploit where someone can make a new account with an existing admin email.
      // This 20 characters is easier to type than manually testing.
      //
      // Also reached when a logout in another tab happens.
      if (!user || user.shouldVerifyEmail) {
        dispatch(LoggedOutAction())
        return
      }

      const registrationStatus = await checkIsRegistered()
      if (!registrationStatus) {
        alert("Couldn't reach the MUD server to check mod status. Try reloading the page.")
        return
      }
      const { isMod, isBanned } = registrationStatus
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
  // this is gated on firebase.auth() being valid, not state.isLoggedIn.
  // Shrug.
  useEffect(() => {
    if (!state.isLoggedIn) return
    refreshRoomList()
  }, [state.isLoggedIn])

  const refreshRoomList = async () => {
    const roomData = await getAllRooms()
    if (roomData) {
      dispatch(UpdateAllRoomsAction(roomData))
    }
  }

  const saveRoom = async () => {
    const roomId = state.displayedRoomId
    if (!aceRef.current || !roomId) {
      alert('No room selected to save.')
      return
    }
    let roomData: Room
    try {
      roomData = JSON.parse(aceRef.current.editor.getValue())
    } catch (e) {
      alert(`Couldn't save room ${roomId}: invalid JSON: ${e}`)
      return
    }
    const result = await updateRoom(roomId, roomData)
    if (!result.ok) {
      alert(`Failed saving room ${roomId}: ${result.error}`)
      return
    }
    const { room } = result.value
    const isNew = !state.roomIds?.includes(room.id)
    // Re-renders reset the editor text to the state's copy of the room, so update that first
    dispatch(UpdateAndShowRoomAction(room.id, room))
    alert(isNew ? `Created room ${room.id} on the server.` : `Saved room ${room.id}.`)
    if (isNew) {
      await refreshRoomList()
    }
  }

  const createRoom = (name: string) => {
    if (state.roomIds?.includes(name)) {
      alert(`Couldn't create room ${name}: a room with that ID already exists.`)
      return
    }
    dispatch(UpdateAndShowRoomAction(name, { displayName: name, shortName: name, id: name, description: '' }))
    alert(`New room ${name} is ready to edit. It isn't on the server until you click Save.`)
  }

  if (!state.checkedAuthentication) {
    return <p role="status">Logging in...</p>
  }

  if (state.isLoggedIn) {
    return (
      <DispatchContext.Provider value={dispatch}>
        <div id='admin-app'>
          <header id='admin-header'>
            <h1>Room Editor:  {state.displayedRoomId || 'no room selected'}</h1>
            <RoomOptionsView roomId={state.displayedRoomId} updateRoom={saveRoom} createRoom={createRoom}/>
          </header>
          <RoomList roomIds={state.roomIds} roomData={state.roomData}/>
          <AceEditor
            mode="json"
            theme="solarized_dark"
            name="editor"
            editorProps={{ $blockScrolling: true }}
            height={'100%'}
            ref={aceRef}
            value={JSON.stringify((state.displayedRoomId && state.roomData[state.displayedRoomId]) || '', null, 2)}
            wrapEnabled={true}
            width={'100%'}
          />
        </div>
      </DispatchContext.Provider>
    )
  } else {
    return <LoggedOutView />
  }
}

export default App
