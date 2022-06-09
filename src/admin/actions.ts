export type Action =
  | LoggedInAction
  | UpdateRoomIdsAction

export enum ActionType {
  LoggedIn = 'LOGGED_IN',
  UpdateRoomIds = 'UPDATE_ROOM_IDS'
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

interface UpdateRoomIdsAction {
  type: ActionType.UpdateRoomIds;
  value: string[];
}

export const UpdateRoomIds = (roomIds: string[]): UpdateRoomIdsAction => {
  return {
    type: ActionType.UpdateRoomIds,
    value: roomIds
  }
}
