import { ThunkDispatch, useReducerWithThunk } from "./useReducerWithThunk";
import { State } from "./reducer";
import { fetchProfile } from "./networking";
import { PublicUser, MinimalUser } from "../server/src/user";

export type Action =
  | UpdatedRoomAction
  | UpdatedPresenceAction
  | PlayerConnectedAction
  | PlayerDisconnectedAction
  | ChatMessageAction
  | WhisperAction
  | ShoutAction
  | PlayerEnteredAction
  | PlayerLeftAction
  | UserMapAction
  | P2PDataReceivedAction
  | P2PStreamReceivedAction
  | LocalMediaStreamOpenedAction
  | ErrorAction
  | SendMessageAction
  | SetNameAction
  | StartWhisperAction
  | ShowProfileAction
  | AuthenticateAction
  | IsRegisteredAction;

export enum ActionType {
  // Server-driven action
  UpdatedRoom = "UPDATED_ROOM",
  UpdatedPresence = "UPDATED_PRESENCE",
  PlayerConnected = "PLAYER_CONNECTED",
  PlayerDisconnected = "PLAYER_DISCONNECTED",
  ChatMessage = "CHAT_MESSAGE",
  Whisper = "WHISPER",
  Shout = "SHOUT",
  PlayerEntered = "PLAYER_ENTERED",
  PlayerLeft = "PLAYER_LEFT",
  Error = "ERROR",
  UserMap = "USER_MAP",
  // WebRTC
  P2PDataReceived = "P2P_DATA_RECEIVED",
  P2PStreamReceived = "P2P_STREAM_RECEIVED",
  LocalMediaStreamOpened = "LOCAL_MEDIASTREAM_OPENED",
  // UI actions
  SendMessage = "SEND_MESSAGE",
  SetName = "SET_NAME",
  StartWhisper = "START_WHISPER",
  ShowProfile = "SHOW_PROFILE",
  //
  Authenticate = "AUTHENTICATE",
  IsRegistered = "IS_REGISTERED",
}

interface UpdatedRoomAction {
  type: ActionType.UpdatedRoom;
  value: {
    name: string;
    description: string;
    allowsMedia: boolean;
  };
}

export const UpdatedRoomAction = (
  name: string,
  description: string,
  allowsMedia: boolean = false
): UpdatedRoomAction => {
  return {
    type: ActionType.UpdatedRoom,
    value: { name, description, allowsMedia },
  };
};

interface UpdatedPresenceAction {
  type: ActionType.UpdatedPresence;
  value: string[];
}

export const UpdatedPresenceAction = (
  users: string[]
): UpdatedPresenceAction => {
  return {
    type: ActionType.UpdatedPresence,
    value: users,
  };
};

interface PlayerConnectedAction {
  type: ActionType.PlayerConnected;
  value: MinimalUser;
}

export const PlayerConnectedAction = (
  user: MinimalUser
): PlayerConnectedAction => {
  return {
    type: ActionType.PlayerConnected,
    value: user,
  };
};

interface PlayerDisconnectedAction {
  type: ActionType.PlayerDisconnected;
  value: string;
}

export const PlayerDisconnectedAction = (
  name: string
): PlayerDisconnectedAction => {
  return {
    type: ActionType.PlayerDisconnected,
    value: name,
  };
};

interface ChatMessageAction {
  type: ActionType.ChatMessage;
  value: {
    name: string;
    message: string;
  };
}

export const ChatMessageAction = (
  name: string,
  message: string
): ChatMessageAction => {
  return {
    type: ActionType.ChatMessage,
    value: { name, message },
  };
};

interface WhisperAction {
  type: ActionType.Whisper;
  value: {
    name: string;
    message: string;
  };
}

export const WhisperAction = (name: string, message: string): WhisperAction => {
  return {
    type: ActionType.Whisper,
    value: { name, message },
  };
};

export const ShoutAction = (name: string, message: string): ShoutAction => {
  return {
    type: ActionType.Shout,
    value: { name, message },
  };
};

interface ShoutAction {
  type: ActionType.Shout;
  value: {
    name: string;
    message: string;
  };
}

interface PlayerEnteredAction {
  type: ActionType.PlayerEntered;
  value: {
    name: string;
    from: string;
  };
}

export const PlayerEnteredAction = (
  name: string,
  from: string
): PlayerEnteredAction => {
  return {
    type: ActionType.PlayerEntered,
    value: { name, from },
  };
};

interface PlayerLeftAction {
  type: ActionType.PlayerLeft;
  value: {
    name: string;
    to: string;
  };
}

export const PlayerLeftAction = (
  name: string,
  to: string
): PlayerLeftAction => {
  return {
    type: ActionType.PlayerLeft,
    value: { name, to },
  };
};

interface UserMapAction {
  type: ActionType.UserMap;
  value: { [userId: string]: MinimalUser };
}

export const UserMapAction = (map: {
  [userId: string]: MinimalUser;
}): UserMapAction => {
  return {
    type: ActionType.UserMap,
    value: map,
  };
};

interface P2PDataReceivedAction {
  type: ActionType.P2PDataReceived;
  value: {
    peerId: string;
    data: string;
  };
}

export const P2PDataReceivedAction = (
  peerId: string,
  data: string
): P2PDataReceivedAction => {
  return {
    type: ActionType.P2PDataReceived,
    value: { peerId, data },
  };
};

interface P2PStreamReceivedAction {
  type: ActionType.P2PStreamReceived;
  value: string;
}

export const P2PStreamReceivedAction = (
  peerId: string
): P2PStreamReceivedAction => {
  return {
    type: ActionType.P2PStreamReceived,
    value: peerId,
  };
};

interface LocalMediaStreamOpenedAction {
  type: ActionType.LocalMediaStreamOpened;
}

export const LocalMediaStreamOpenedAction = (): LocalMediaStreamOpenedAction => {
  return { type: ActionType.LocalMediaStreamOpened };
};

interface ErrorAction {
  type: ActionType.Error;
  value: string;
}

export const ErrorAction = (error: string): ErrorAction => {
  return {
    type: ActionType.Error,
    value: error,
  };
};

// UI Actions

interface SendMessageAction {
  type: ActionType.SendMessage;
  value: string;
}

export const SendMessageAction = (message: string): SendMessageAction => {
  return {
    type: ActionType.SendMessage,
    value: message,
  };
};

interface SetNameAction {
  type: ActionType.SetName;
  value: string;
}

export const SetNameAction = (name: string): SetNameAction => {
  return {
    type: ActionType.SetName,
    value: name,
  };
};

interface StartWhisperAction {
  type: ActionType.StartWhisper;
  value: string;
}

export const StartWhisperAction = (name: string): StartWhisperAction => {
  return { type: ActionType.StartWhisper, value: name };
};

interface ShowProfileAction {
  type: ActionType.ShowProfile;
  value: PublicUser;
}

export const ShowProfileAction = (
  name: string
): ((dispatch: ThunkDispatch<Action, State>) => void) => {
  return async (dispatch: ThunkDispatch<Action, State>) => {
    console.log("lol");
    const user = await fetchProfile(name);
    if (!user) {
      console.log("No user");
      return;
    }
    dispatch(ShowProfileActionForFetchedUser(user));
  };
};

export const ShowProfileActionForFetchedUser = (
  user: PublicUser
): ShowProfileAction => {
  return {
    type: ActionType.ShowProfile,
    value: user,
  };
};

interface AuthenticateAction {
  type: ActionType.Authenticate;
  value: { name: string; userId: string };
}

export const AuthenticateAction = (
  userId: string | undefined,
  name: string | undefined
): AuthenticateAction => {
  return { type: ActionType.Authenticate, value: { userId, name } };
};

interface IsRegisteredAction {
  type: ActionType.IsRegistered;
}

export const IsRegisteredAction = (): IsRegisteredAction => {
  return { type: ActionType.IsRegistered };
};
