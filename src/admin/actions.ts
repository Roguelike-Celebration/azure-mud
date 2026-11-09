import { RoomDataMap } from '../reducer.js'
import { Room } from '../room.js'

export type Action =
  | LoggedInAction
  | LoggedOutAction
  | UpdateAllRoomsAction
  | UpdateAndShowRoomAction
  | SetEditorTextAction

export enum ActionType {
  LoggedIn = 'LOGGED_IN',
  LoggedOut = 'LOGGED_OUT',
  UpdateAllRooms = 'UPDATE_ALL_ROOMS',
  UpdateAndShowRoom = 'UPDATE_AND_SHOW_ROOM',
  SetEditorText = 'SET_EDITOR_TEXT'
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

interface UpdateAllRoomsAction {
  type: ActionType.UpdateAllRooms;
  value: RoomDataMap;
}

export const UpdateAllRoomsAction = (roomData: RoomDataMap): UpdateAllRoomsAction => {
  return {
    type: ActionType.UpdateAllRooms,
    value: roomData
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

interface SetEditorTextAction {
  type: ActionType.SetEditorText;
  value: string;
}

export const SetEditorTextAction = (text: string): SetEditorTextAction => {
  return {
    type: ActionType.SetEditorText,
    value: text
  }
}
