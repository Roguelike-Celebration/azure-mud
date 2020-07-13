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
  | ErrorAction
  | SendMessageAction
  | SetNameAction
  | StartWhisperAction;

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
  // UI actions
  SendMessage = "SEND_MESSAGE",
  SetName = "SET_NAME",
  StartWhisper = "START_WHISPER",
}

interface UpdatedRoomAction {
  type: ActionType.UpdatedRoom;
  value: {
    name: string;
    description: string;
  };
}

export const UpdatedRoomAction = (
  name: string,
  description: string
): UpdatedRoomAction => {
  return {
    type: ActionType.UpdatedRoom,
    value: { name, description },
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
  value: string;
}

export const PlayerConnectedAction = (name: string): PlayerConnectedAction => {
  return {
    type: ActionType.PlayerConnected,
    value: name,
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
