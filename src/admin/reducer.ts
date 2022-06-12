import firebase from 'firebase/app'
import Config from '../config'
import { Room } from '../room'
import { Action, ActionType } from './actions'

export interface State {
  firebaseApp: firebase.app.App
  isLoggedIn: boolean

  roomIds?: string[]
  roomData: {[roomId: string]: Room}

  displayedRoomId?: string
}

export const defaultState: State = {
  firebaseApp: firebase.initializeApp(Config.FIREBASE_CONFIG),
  isLoggedIn: false,
  roomData: {}
}

// TODO: Split this out into separate reducers based on worldstate actions vs UI actions?
export default (oldState: State, action: Action): State => {
  const state: State = JSON.parse(JSON.stringify(oldState))

  if (action.type === ActionType.LoggedIn) {
    state.isLoggedIn = true
  }

  if (action.type === ActionType.UpdateRoomIds) {
    state.roomIds = action.value
  }

  if (action.type === ActionType.UpdateAndShowRoom) {
    state.roomData[action.value.roomId] = action.value.roomData
    state.displayedRoomId = action.value.roomId
  }

  return state
}
