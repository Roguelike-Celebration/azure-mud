export type Action =
  | LoggedInAction

export enum ActionType {
  LoggedIn = 'LOGGED_IN',
}

interface LoggedInAction {
  type: ActionType.LoggedIn;
  value: undefined;
}

export const LoggedInAction = (): LoggedInAction => {
  return {
    type: ActionType.LoggedIn,
    value: undefined
  }
}
