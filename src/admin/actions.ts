import { Room } from '../room'

export type Action =
  | LoggedInAction
  | UpdateRoomIdsAction
  | UpdateAndShowRoomAction

export enum ActionType {
  LoggedIn = 'LOGGED_IN',
  UpdateRoomIds = 'UPDATE_ROOM_IDS',
  UpdateAndShowRoom = 'UPDATE_AND_SHOW_ROOM'
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

interface UpdateAndShowRoomAction {
  type: ActionType.UpdateAndShowRoom;
  value: {
    roomId: string
    roomData: Room
  };
}

export const UpdateAndShowRoomAction = (roomId: string, roomData: Room): UpdateAndShowRoomAction => {
  return {
    type: ActionType.UpdateAndShowRoom,
    value: { roomId, roomData }
  }
}
