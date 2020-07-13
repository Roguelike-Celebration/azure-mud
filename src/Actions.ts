export type Action =
  | UpdatedRoomAction
  | UpdatedPresenceAction
  | PlayerConnectedAction
  | PlayerDisconnectedAction
  | ChatMessageAction
  | WhisperAction
  | PlayerEnteredAction
  | PlayerLeftAction
  | ErrorAction
  | SendMessageAction
  | SetNameAction;

export enum ActionType {
  // Server-driven action
  UpdatedRoom = "UPDATED_ROOM",
  UpdatedPresence = "UPDATED_PRESENCE",
  PlayerConnected = "PLAYER_CONNECTED",
  PlayerDisconnected = "PLAYER_DISCONNECTED",
  ChatMessage = "CHAT_MESSAGE",
  Whisper = "WHISPER",
  PlayerEntered = "PLAYER_ENTERED",
  PlayerLeft = "PLAYER_LEFT",
  Error = "ERROR",
  // UI actions
  SendMessage = "SEND_MESSAGE",
  SetName = "SET_NAME",
}

interface UpdatedRoomAction {
  type: ActionType.UpdatedRoom;
  value: {
    name: string;
    description: string;
  };
}

interface UpdatedPresenceAction {
  type: ActionType.UpdatedPresence;
  value: string[];
}

interface PlayerConnectedAction {
  type: ActionType.PlayerConnected;
  value: string;
}

interface PlayerDisconnectedAction {
  type: ActionType.PlayerDisconnected;
  value: string;
}

interface ChatMessageAction {
  type: ActionType.ChatMessage;
  value: {
    name: string;
    message: string;
  };
}

interface WhisperAction {
  type: ActionType.Whisper;
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

interface PlayerLeftAction {
  type: ActionType.PlayerLeft;
  value: {
    name: string;
    to: string;
  };
}

interface ErrorAction {
  type: ActionType.Error;
  value: string;
}

// UI Actions

interface SendMessageAction {
  type: ActionType.SendMessage;
  value: string;
}

interface SetNameAction {
  type: ActionType.SetName;
  value: string;
}
