import { Action, ActionType } from './actions'

export interface State {
  isLoggedIn: boolean
}

export const defaultState: State = {
  isLoggedIn: false
}

// TODO: Split this out into separate reducers based on worldstate actions vs UI actions?
export default (oldState: State, action: Action): State => {
  const state: State = JSON.parse(JSON.stringify(oldState))

  console.log(action, action.type, ActionType.LoggedIn)
  if (action.type === ActionType.LoggedIn) {
    state.isLoggedIn = true
  }

  console.log('Logged in!', state)

  return state
}
