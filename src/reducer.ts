import { Action, ActionType, StopVideoChatAction } from "./Actions";
import {
  Message,
  createConnectedMessage,
  createDisconnectedMessage,
  createEnteredMessage,
  createLeftMessage,
  createChatMessage,
  createWhisperMessage,
  createErrorMessage,
  createShoutMessage,
  createModMessage,
} from "./message";
import { Room } from "./Room";
import {
  sendChatMessage,
  toggleUserBan,
  setNetworkMediaChatStatus,
} from "./networking";
import { PublicUser, MinimalUser } from "../server/src/user";
import { disconnectAllPeers } from "./webRTC";

export interface State {
  authenticated: boolean;
  checkedAuthentication: boolean;

  hasRegistered: boolean;

  room?: Room;
  messages: Message[];
  userId?: string;
  userMap: { [userId: string]: MinimalUser };

  prepopulatedInput?: string;

  localMediaStreamId?: string;
  otherMediaStreamPeerIds?: string[];

  inMediaChat: boolean;
  mediaDevices?: MediaDeviceInfo[];

  // User ID of whose profile should be shwon
  visibleProfile?: PublicUser;
}

export const defaultState: State = {
  authenticated: false,
  checkedAuthentication: false,
  hasRegistered: false,
  messages: [],
  userMap: {},
  inMediaChat: false
}

// TODO: Split this out into separate reducers based on worldstate actions vs UI actions?
export default (oldState: State, action: Action): State => {
  console.log("In reducer", action);

  // TODO: This could hurt perf when we have a lot of messages
  let state: State = JSON.parse(JSON.stringify(oldState));
  state.prepopulatedInput = undefined;

  if (action.type === ActionType.UpdatedRoom) {
    state.room = action.value;
    state.room.users = state.room.users.filter((u) => u !== state.userId);

    /** Here lies a giant hack.
     * So, the WebRTC connection handshake lives outside of Flux.
     * The set of peer connections are long-lived objects that shouldn't live inside React components,
     * but they also need access to a `dispatch` function, so having them separate seems easiest.
     *
     * HOWEVER!
     * When a new peer says "hey, you can connect to me", we need some state data.
     * Specifically, we need to know if you're currently in a videocall.
     * This means we need to do some state-munging to actively remove you from a call once you've left the room.
     *
     * TODO: There may be cases other than moving rooms where we want to disconnect you.
     * If so, we need to dupe this logic there.
     */
    (action as Action).type = ActionType.StopVideoChat;
  }

  if (action.type === ActionType.UpdatedPresence) {
    state.room.users = action.value.filter((u) => u !== state.userId);
  }

  if (action.type === ActionType.PlayerConnected) {
    const user = action.value;
    if (!state.room.users.includes(user.id)) {
      state.room.users.push(user.id);
      state.messages.push(createConnectedMessage(user.id));
    }
    state.userMap[user.id] = user;
  }

  if (action.type === ActionType.PlayerDisconnected) {
    state.room.users = state.room.users.filter((u) => u !== action.value);
    state.messages.push(createDisconnectedMessage(action.value));
  }

  if (action.type === ActionType.PlayerEntered) {
    if (!state.room.users.includes(action.value.name)) {
      state.room.users.push(action.value.name);
      state.messages.push(
        createEnteredMessage(action.value.name, action.value.from)
      );
    }
  }

  if (action.type === ActionType.PlayerLeft) {
    state.room.users = state.room.users.filter((u) => u !== action.value.name);
    state.messages.push(createLeftMessage(action.value.name, action.value.to));
  }

  if (action.type === ActionType.ChatMessage) {
    state.messages.push(
      createChatMessage(action.value.name, action.value.message)
    );
  }

  if (action.type === ActionType.Whisper) {
    state.messages.push(
      createWhisperMessage(action.value.name, action.value.message)
    );
  }

  if (action.type === ActionType.ModMessage) {
    state.messages.push(
      createModMessage(
        action.value.name,
        action.value.message,
        action.value.name === state.userId
      )
    );
  }

  if (action.type === ActionType.Shout) {
    state.messages.push(
      createShoutMessage(action.value.name, action.value.message)
    );
  }

  if (action.type === ActionType.UserMap) {
    state.userMap = { ...state.userMap, ...action.value };
  }

  if (action.type === ActionType.Error) {
    state.messages.push(createErrorMessage(action.value));
  }

  // WebRTC
  if (action.type === ActionType.LocalMediaStreamOpened) {
    state.localMediaStreamId = action.value;
  }

  if (action.type === ActionType.P2PStreamReceived) {
    if (!state.otherMediaStreamPeerIds) {
      state.otherMediaStreamPeerIds = [];
    }

    if (!state.otherMediaStreamPeerIds.includes(action.value)) {
      state.otherMediaStreamPeerIds.push(action.value);
    }
  }

  if (action.type === ActionType.P2PDataReceived) {
    console.log("Received P2P data!", action.value.peerId, action.value.data);
  }

  if (action.type === ActionType.P2PConnectionClosed) {
    state.otherMediaStreamPeerIds = state.otherMediaStreamPeerIds.filter(
      (p) => p !== action.value
    );
  }

  if (action.type === ActionType.P2PWaitingForConnections) {
    state.inMediaChat = true;
    delete state.mediaDevices;
  }

  if (action.type === ActionType.LocalMediaDeviceListReceived) {
    state.mediaDevices = action.value;
  }

  if (action.type === ActionType.StopVideoChat) {
    setNetworkMediaChatStatus(false);
    disconnectAllPeers();
    delete state.localMediaStreamId = false;
    delete state.otherMediaStreamPeerIds;
    state.inMediaChat = false;
  }

  // UI Actions
  if (action.type === ActionType.SendMessage) {
    sendChatMessage(action.value);

    const isCommand = /^\/(.+?) (.+)/.exec(action.value);
    if (isCommand) {
      if (isCommand[1] === "whisper") {
        const [_, username, message] = /^(.+?) (.+)/.exec(isCommand[2]);
        const user = Object.values(state.userMap).find(
          (u) => u.username === username
        );
        const userId = user && user.id;
        if (userId) {
          state.messages.push(createWhisperMessage(userId, message, true));
        }
      }
    } else {
      state.messages.push(createChatMessage(state.userId, action.value));
    }
  }

  if (action.type === ActionType.StartWhisper) {
    state.prepopulatedInput = `/whisper ${action.value} `;
  }

  if (action.type === ActionType.ShowProfile) {
    state.visibleProfile = action.value;
  }
  if (action.type === ActionType.Authenticate) {
    state.checkedAuthentication = true;

    if (action.value.userId && action.value.name) {
      state.authenticated = true;
      state.userId = action.value.userId;

      // If you haven't registered yet, we need to grab your username before we've pulled a server userMap
      state.userMap[action.value.userId] = {
        id: action.value.userId,
        username: action.value.name,
      };
    }
  }

  if (action.type === ActionType.IsRegistered) {
    state.hasRegistered = true;
  }

  if (action.type === ActionType.BanToggle) {
    toggleUserBan(action.value);
  }

  return state;
};
