import firebase from 'firebase/app'
import _ from 'lodash'

import Config from '../config.js'
import { RoomDataMap } from '../reducer.js'

import { Action, ActionType } from './actions.js'

export interface State {
  firebaseApp: firebase.app.App
  checkedAuthentication: boolean
  isLoggedIn: boolean

  roomIds?: string[]
  /** Live room data, as last fetched from or saved to the server. */
  roomData: RoomDataMap

  displayedRoomId?: string
  /** Text in the room editor, which may be unsaved or invalid JSON. */
  editorText: string
}

export const defaultState: State = {
  firebaseApp: firebase.initializeApp(Config.FIREBASE_CONFIG),
  checkedAuthentication: false,
  isLoggedIn: false,
  roomData: {},
  editorText: ''
}

/** Whether the room editor holds changes that aren't saved to the server. */
export function hasUnsavedChanges (state: State): boolean {
  const roomId = state.displayedRoomId
  if (!roomId) {
    return false
  }
  // A room from Create isn't on the server until it's saved
  if (!state.roomIds?.includes(roomId)) {
    return true
  }
  try {
    // Compare data, not text, so whitespace and key order don't count as changes
    return !_.isEqual(JSON.parse(state.editorText), state.roomData[roomId])
  } catch {
    return true
  }
}

// TODO: Split this out into separate reducers based on worldstate actions vs UI actions?
export default (oldState: State, action: Action): State => {
  const state: State = JSON.parse(JSON.stringify(oldState))

  if (action.type === ActionType.LoggedIn) {
    state.checkedAuthentication = true
    state.isLoggedIn = true
  }

  if (action.type === ActionType.LoggedOut) {
    state.checkedAuthentication = true
    state.isLoggedIn = false
  }

  if (action.type === ActionType.UpdateAllRooms) {
    state.roomIds = Object.keys(action.value)
    // Merge, so an unsaved new room in the editor isn't dropped
    state.roomData = { ...state.roomData, ...action.value }
  }

  if (action.type === ActionType.UpdateAndShowRoom) {
    state.roomData[action.value.roomId] = action.value.roomData
    state.displayedRoomId = action.value.roomId
    state.editorText = JSON.stringify(action.value.roomData, null, 2)
  }

  if (action.type === ActionType.SetEditorText) {
    state.editorText = action.value
  }

  return state
}
