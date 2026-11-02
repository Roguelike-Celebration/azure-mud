import { Room } from '../room.js'

export type Action =
  | LoggedInAction
  | LoggedOutAction
  | UpdateRoomIdsAction
  | UpdateAndShowRoomAction

export enum ActionType {
  LoggedIn = 'LOGGED_IN',
  LoggedOut = 'LOGGED_OUT',
  UpdateRoomIds = 'UPDATE_ROOM_IDS',
  UpdateAndShowRoom = 'UPDATE_AND_SHOW_ROOM'
}

interface LoggedInAction {
  type: ActionType.LoggedIn;
  value: undefined;
}

interface LoggedOutAction {
  type: ActionType.LoggedOut;
  value: undefined;
}

export const LoggedInAction = (): LoggedInAction => {
  return {
    type: ActionType.LoggedIn,
    value: undefined
  }
}

export const LoggedOutAction = (): LoggedOutAction => {
  return {
    type: ActionType.LoggedOut,
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
