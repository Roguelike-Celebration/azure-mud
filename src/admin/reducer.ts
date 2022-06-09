import firebase from 'firebase/app'
import Config from '../config'
import { Action, ActionType } from './actions'

export interface State {
  firebaseApp: firebase.app.App
  isLoggedIn: boolean
  roomIds?: string[]
}

export const defaultState: State = {
  firebaseApp: firebase.initializeApp(Config.FIREBASE_CONFIG),
  isLoggedIn: false
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

  return state
}
